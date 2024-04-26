//编辑课程-课程卡片
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, TreeSelect, Select, InputNumber, Modal, message, Icon } from 'antd';
import styles from './courseDetail.less';
import icon from '../../../../icon.less';
import { calculateTime, getCourseColor } from '../../../../utils/utils';
import EditSystemCourse from '../OperModal/editCourse.js';
import { intoChinese } from '../../../../utils/utils';
import { locale, trans } from '../../../../utils/i18n';
import moment from 'moment';
import { isEmpty } from 'lodash';

const { confirm } = Modal;

@connect((state) => ({
    clickTeacherId: state.timeTable.clickTeacherId, // 存储当前点击教师的id
    clickAddressId: state.timeTable.clickAddressId, // 存储当前点击场地的id
    tableView: state.timeTable.tableView,
    mainScheduleData: state.lessonView.mainScheduleData,
}))
export default class CourseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditCourse: false,
            isFetch: false, // 教师请求状态控制
            isFetchAddress: false, // 场地
            isFetchGroup: false, // 班级
            courseDetailCard: {},
        };
    }

    componentDidMount() {
        const { courseDetail } = this.props;
        this.setState({
            courseDetailCard: courseDetail,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            JSON.stringify(nextProps.courseDetail) != JSON.stringify(this.state.courseDetailCard) ||
            nextProps.arrangeModal != this.props.arrangeModal
        ) {
            this.setState({
                courseDetailCard: { ...nextProps.courseDetail },
            });
        }
    }

    // 恢复请求数据
    recoverData = (lessonRelateInfo) => {
        let { showTable } = this.props;
        // 请求列表
        typeof showTable == 'function' && showTable.call(this, '锁定', lessonRelateInfo);
    };

    //判断当前版本是否发布
    judgePublicVersion = (callback) => {
        const { dispatch, currentVersion } = this.props;
        //判断当前版本是否发布
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行锁定操作~');
                    return false;
                } else {
                    callback();
                }
            },
        });
    };

    getLayerClasslistByAcId = (item) => {
        if (item.acId) {
            let domList = Array.from(document.querySelectorAll(`[data-acid='${item.acId}']`));
            return domList.map((item) => Number(item.dataset.studentgroupid));
        } else {
            return [];
        }
    };

    getLayerClasslistByDetailId = (item) => {
        if (item.compareGroupIdList) {
            return item.compareGroupIdList;
        } else return [];
    };

    //锁定单节课
    lockUtilLesson(id, e) {
        const {
            dispatch,
            courseDetail,
            courseDetail: { studentGroups, mainTeachers, assistantTeachers, roomId },
            showExchangeClassTable,
            getLessonViewMsg,
        } = this.props;

        e.stopPropagation();
        if (showExchangeClassTable) return;

        if (!this.props.lockGray) return;
        const lessonRelateInfo = {
            sourceGroupIdList: studentGroups.map((item) => item.id),
            sourceMainTeacherIdList: mainTeachers.map((item) => item.id),
            sourceAssistantTeacherIdList: assistantTeachers.map((item) => item.id),
            sourceRoomId: roomId ? [roomId] : [],

            targetGroupIdList: [],
            targetMainTeacherIdList: [],
            targetAssistantTeacherIdList: [],

            layerClassIdList: [
                ...this.getLayerClasslistByAcId(courseDetail),
                ...this.getLayerClasslistByDetailId(courseDetail),
            ],
            flag: Boolean(true),
        };
        this.judgePublicVersion(() => {
            dispatch({
                type: 'timeTable/lockUtilLesson',
                payload: {
                    resultId: courseDetail.id,
                    type: 1,
                },
                onSuccess: () => {
                    getLessonViewMsg();
                    this.lookCourseDetail();
                    this.recoverData(lessonRelateInfo);
                },
            });
        });
    }

    //解锁单节课
    unLockUtilLesson(id, e) {
        const {
            dispatch,
            courseDetail,
            courseDetail: { studentGroups, mainTeachers, assistantTeachers, roomId },
            showExchangeClassTable,
            getLessonViewMsg,
        } = this.props;
        e.stopPropagation();
        if (showExchangeClassTable) return;
        const lessonRelateInfo = {
            sourceGroupIdList: studentGroups.map((item) => item.id),
            sourceMainTeacherIdList: mainTeachers.map((item) => item.id),
            sourceAssistantTeacherIdList: assistantTeachers.map((item) => item.id),
            sourceRoomId: roomId ? [roomId] : [],

            targetGroupIdList: [],
            targetMainTeacherIdList: [],
            targetAssistantTeacherIdList: [],

            layerClassIdList: [
                ...this.getLayerClasslistByAcId(courseDetail),
                ...this.getLayerClasslistByDetailId(courseDetail),
            ],
            flag: Boolean(true),
        };
        this.judgePublicVersion(() => {
            dispatch({
                type: 'timeTable/unLockUtilLesson',
                payload: {
                    resultId: courseDetail.id,
                },
                onSuccess: () => {
                    getLessonViewMsg();

                    this.lookCourseDetail();
                    this.recoverData(lessonRelateInfo);
                },
            });
        });
    }

    //课程调用详情--供解锁课程用
    lookCourseDetail = () => {
        const { dispatch, courseDetail, showExchangeClassTable } = this.props;
        dispatch({
            type: 'timeTable/lookCourseDetail',
            payload: {
                id: courseDetail.id,
                type: 1,
            },
            onSuccess: (res) => {
                this.setState(
                    {
                        courseDetailCard: res,
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            },
        });
    };

    //编辑卡片
    editCard = (e) => {
        e.stopPropagation();
        const { notShowWillCard, showExchangeClassTable } = this.props;
        // notShowWillCard为true双击不能编辑，showExchangeClassTable为true显示转待排不能编辑
        if (showExchangeClassTable || notShowWillCard) {
            return;
        }
        this.setState({
            showEditCourse: true,
        });
    };

    //取消--系统排课编辑
    hideSystemModal = (type) => {
        this.setState({
            showEditCourse: false,
        });
    };

    //取消编辑自由排课
    hideEditFreeModal = () => {
        this.setState({
            showEditFreedomCourse: false,
        });
    };

    //删除卡片
    deleteCard = (courseDetail, e) => {
        e.stopPropagation();
        if (this.props.showExchangeClassTable) return;
        const {
            dispatch,
            cardUtil,
            showTable,
            fetchCourseList,
            getArrangeListFirst,
            willCardLightState,
            willCourseId,
            willGroupId,
            changeCourse,
            arrangeDetailList,
            courseDetail: { studentGroups, mainTeachers, assistantTeachers, roomId, type },
        } = this.props;
        let self = this;
        const lessonRelateInfo = {
            sourceGroupIdList: studentGroups.map((item) => item.id),
            sourceMainTeacherIdList: mainTeachers.map((item) => item.id),
            sourceAssistantTeacherIdList: assistantTeachers.map((item) => item.id),
            sourceRoomId: roomId ? [roomId] : [],

            targetGroupIdList: [],
            targetMainTeacherIdList: [],
            targetAssistantTeacherIdList: [],

            layerClassIdList: [
                ...this.getLayerClasslistByAcId(courseDetail),
                ...this.getLayerClasslistByDetailId(courseDetail),
            ],

            flag: Boolean(true),
        };
        confirm({
            title: '您确定要删除吗？',
            okText: '确定',
            cancelText: '放弃',
            onOk: () => {
                // 已排删除
                if (type == 1) {
                    dispatch({
                        type: 'timeTable/deleteCourse',
                        payload: {
                            id: cardUtil.resultId,
                        },
                        onSuccess: () => {
                            typeof showTable == 'function' &&
                                showTable.call(this, '删除', lessonRelateInfo); // 请求列表
                            //根据课程和班级ID刷新
                            typeof getArrangeListFirst == 'function' && getArrangeListFirst('', 2);
                            typeof willCardLightState == 'function' && willCardLightState.call();
                            typeof fetchCourseList == 'function' && fetchCourseList();
                        },
                    });
                    // 待排删除
                } else if (type == 2) {
                    dispatch({
                        type: 'timeTable/deleteCard',
                        payload: {
                            id: courseDetail.acId,
                        },
                        onSuccess: () => {
                            // 请求列表
                            typeof showTable == 'function' &&
                                showTable.call(this, '删除', lessonRelateInfo);
                            //根据课程和班级ID刷新,
                            //如果arrangeDetailList长度为1，表明中间课节数只有1，删除之后需要重制课程搜索条件

                            console.log('changeCourse :>> ', changeCourse);
                            typeof changeCourse == 'function' &&
                                changeCourse(
                                    arrangeDetailList.length === 1 ? undefined : willCourseId
                                );
                        },
                    });
                }

                const { tableView, getLessonViewMsg } = this.props;
                if (tableView === 'weekLessonView') {
                    typeof getLessonViewMsg == 'function' && getLessonViewMsg();
                }
            },
        });
    };

    // 判断是否已添加
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

    // 点击教师查看教师课程
    getTeachersCourse = (el, e) => {
        const { tableView } = this.props;
        e.stopPropagation();
        const { isFetch } = this.state;
        let _this = this;
        if (isFetch) return; //判断是否请求中
        if (tableView === 'weekLessonView') {
            const { getCustomScheduleInLessonView } = this.props;
            getCustomScheduleInLessonView('teacher', el.id);
        } else {
            const {
                dispatch,
                studentGroupId,
                currentVersion,
                searchIndex,
                showExchangeClassTable,
            } = this.props;
            // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
            if (this.judgeRepeat(el.id, el.name)) {
                message.info('课表已存在该老师');
                return;
            }
            this.setState(
                {
                    isFetch: true,
                },
                () => {
                    dispatch({
                        type: 'timeTable/findTeacherSchedule',
                        payload: {
                            id: currentVersion,
                            teacherIds: [el.id],
                            actionType:
                                searchIndex == 5 && !showExchangeClassTable ? 'custom' : 'detail', // 前端自定义属性，确认触发请求的位置
                            groupId: studentGroupId, // 前端自定义属性，确认点击教师属于的班级
                        },
                    }).then(() => {
                        // 点击详情添加一行，存储添加行的id,方便自定义视角调换课后重新请求数据
                        console.log('_this :>> ', _this);
                        _this.props.saveCustomValue(el.id, 'customTeacher');
                        this.setState({
                            isFetch: false,
                        });
                    });
                }
            );
        }
    };

    // 点击场地查看场地对应课程
    getAddressCourse = (roomId, name, e) => {
        const { tableView } = this.props;
        e.stopPropagation();
        const { isFetchAddress } = this.state;
        let _this = this;
        if (isFetchAddress) return;
        if (tableView === 'weekLessonView') {
            const { getCustomScheduleInLessonView } = this.props;
            getCustomScheduleInLessonView('address', roomId);
        } else {
            const {
                dispatch,
                currentVersion,
                studentGroupId,
                searchIndex,
                showExchangeClassTable,
            } = this.props;
            // 判断课表中添加的场地是否与当前点击的相等，若相等，课表已存在不添加
            if (this.judgeRepeat(roomId, name)) {
                message.info('课表已存在该场地');
                return;
            }
            this.setState(
                {
                    isFetchAddress: true,
                },
                () => {
                    dispatch({
                        type: 'timeTable/findFieldSchedule',
                        payload: {
                            id: currentVersion,
                            playgroundIds: [roomId],
                            actionType:
                                searchIndex == 5 && !showExchangeClassTable ? 'custom' : 'detail', // 前端自定义属性，确认触发请求的位置
                            groupId: studentGroupId, // 前端自定义属性，确认点击教师属于的班级
                        },
                    }).then(() => {
                        _this.props.saveCustomValue(roomId, 'customAddress');
                        this.setState({
                            isFetchAddress: false,
                        });
                    });
                }
            );
        }
    };

    // 点击班级查看对应课程
    getGroupCourse(id, name, e) {
        const { tableView } = this.props;
        e.stopPropagation();
        const { isFetchGroup } = this.state;
        let _this = this;
        if (isFetchGroup) return;

        if (tableView === 'weekLessonView') {
            const { getCustomScheduleInLessonView } = this.props;
            getCustomScheduleInLessonView('group', id);
        } else {
            const {
                dispatch,
                currentVersion,
                studentGroupId,
                searchIndex,
                showExchangeClassTable,
            } = this.props;
            // 判断课表中添加的班级是否与当前点击的相等，若相等，课表已存在不添加
            if (this.judgeRepeat(id, name)) {
                message.info('课表已存在该班级');
                return;
            }
            this.setState(
                {
                    isFetchGroup: true,
                },
                () => {
                    dispatch({
                        type: 'timeTable/fetchGroupList',
                        payload: {
                            id: currentVersion,
                            groupIds: [id],
                            actionType:
                                searchIndex == 5 && !showExchangeClassTable ? 'custom' : 'detail', // 前端自定义属性，确认触发请求的位置
                            groupId: studentGroupId, // 前端自定义属性，确认点击教师属于的班级
                        },
                    }).then(() => {
                        _this.props.saveCustomValue(id, 'customGroup');
                        this.setState({
                            isFetchGroup: false,
                        });
                    });
                }
            );
        }
    }

    //格式化教师
    formatTeacher = (teacher, type) => {
        if (!teacher) return;
        return teacher && teacher.length > 0
            ? teacher.map((el, index) => {
                  return (
                      <span
                          className={styles.name}
                          key={index}
                          onClick={this.getTeachersCourse.bind(this, el)}
                      >
                          {type == 'cooperateTeacher' && <em>*</em>}
                          {el.name}
                      </span>
                  );
              })
            : '';
    };

    bufferChange = () => {
        const { handleAcBuffer } = this.props;
        const { courseDetailCard } = this.state;
        typeof handleAcBuffer == 'function' && handleAcBuffer(courseDetailCard.acId, true);
    };

    render() {
        const { published, isNewPublish, isHistoryPublish, arrangeModal, showExchangeClassTable } =
            this.props;
        const { courseDetailCard, showEditCourse } = this.state;

        // 点击不同课程渲染相应背景色和border
        let bkgColor = courseDetailCard && getCourseColor(courseDetailCard.courseName, 2);
        // 判断是最新公布版本
        let canClickOper = isNewPublish ? true : isHistoryPublish ? false : true;
        let disabled = !canClickOper ? styles.disable : '';
        let isShowDouble = courseDetailCard && courseDetailCard.duration != 1 ? true : false;

        return (
            <div className={styles.courseDetailContent}>
                {courseDetailCard && JSON.stringify(courseDetailCard) != '{}' && (
                    <div className={styles.courseDetailCard}>
                        <div className={styles.courseInfo}>
                            <span
                                className={styles.headInfo}
                                style={{ background: bkgColor || 'rgba(55,152,255,.1)' }}
                            >
                                <div
                                    className={styles.title}
                                    style={{ background: bkgColor || 'rgba(55,152,255,.1)' }}
                                >
                                    <div className={styles.leftInfo}>
                                        {/* 课程名称 */}
                                        <span className={styles.courseName}>
                                            {locale() !== 'en'
                                                ? courseDetailCard.courseName
                                                : courseDetailCard.courseEnglishName}
                                        </span>
                                        <span className={styles.singleTime}>
                                            {courseDetailCard.frequency == 0
                                                ? trans('global.Every week', '每周')
                                                : courseDetailCard.frequency == 1
                                                ? trans('global.Single week', '单周')
                                                : trans('global.Double week', '双周')}
                                        </span>
                                        {/* 周几第几节 */}
                                        <span className={styles.weekNum}>
                                            {courseDetailCard.type === 1 &&
                                                `周${intoChinese(courseDetailCard.weekDay)}第${
                                                    courseDetailCard.lesson
                                                }节 ${moment(
                                                    courseDetailCard.startTimeMillion
                                                ).format('HH:mm')} - ${moment(
                                                    courseDetailCard.endTimeMillion
                                                ).format('HH:mm')}`}
                                        </span>
                                        {/* 时间 */}
                                        <span className={styles.singleTime}>
                                            {`${courseDetailCard.singleTime}min`}
                                            {isShowDouble && (
                                                <em>* {courseDetailCard.duration} </em>
                                            )}
                                        </span>
                                        <div className={styles.middle}>
                                            {/* 参与班级 */}
                                            <span className={styles.mainTeacher}>
                                                {courseDetailCard.studentGroups &&
                                                courseDetailCard.studentGroups.length > 0
                                                    ? courseDetailCard.studentGroups.map(
                                                          (el, index) => {
                                                              return (
                                                                  <span
                                                                      className={styles.name}
                                                                      key={index}
                                                                      onClick={this.getGroupCourse.bind(
                                                                          this,
                                                                          el.id,
                                                                          el.name
                                                                      )}
                                                                  >
                                                                      {locale() !== 'en'
                                                                          ? el.name
                                                                          : el.englishName}
                                                                  </span>
                                                              );
                                                          }
                                                      )
                                                    : null}
                                            </span>
                                            {/* 主教老师 */}
                                            <span className={styles.mainTeacher}>
                                                {courseDetailCard.mainTeachers && (
                                                    <span className={styles.content}>
                                                        {this.formatTeacher(
                                                            courseDetailCard.mainTeachers,
                                                            'mainTeacher'
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                            {/* 协同老师 */}
                                            {courseDetailCard.assistantTeachers &&
                                                courseDetailCard.assistantTeachers.length > 0 && (
                                                    <span className={styles.cooperateTeacher}>
                                                        {courseDetailCard.assistantTeachers && (
                                                            <span className={styles.content}>
                                                                {this.formatTeacher(
                                                                    courseDetailCard.assistantTeachers,
                                                                    'cooperateTeacher'
                                                                )}
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                        </div>
                                        {/* 上课地点 */}
                                        <span className={styles.address}>
                                            <span
                                                className={styles.name}
                                                onClick={this.getAddressCourse.bind(
                                                    this,
                                                    courseDetailCard.roomId,
                                                    courseDetailCard.roomName
                                                )}
                                                style={{
                                                    background: courseDetailCard.roomName
                                                        ? '#F3F3F3'
                                                        : '#fff',
                                                }}
                                            >
                                                {courseDetailCard.roomName}
                                            </span>
                                        </span>
                                    </div>

                                    {/* 操作 */}
                                    <div className={styles.detailAction}>
                                        <span className={styles.top}>
                                            {
                                                //canClickOper 判断是否为最新版本 lastPublicContent判断是否为已发布版本
                                                !published &&
                                                    courseDetailCard &&
                                                    courseDetailCard.id &&
                                                    courseDetailCard.type === 1 &&
                                                    (courseDetailCard.locked ? (
                                                        <span
                                                            className={styles.unLockButtonStyle}
                                                            title="解锁"
                                                            onClick={this.unLockUtilLesson.bind(
                                                                this,
                                                                courseDetailCard.id
                                                            )}
                                                        >
                                                            <i className={icon.iconfont}>
                                                                &#xe744;
                                                            </i>
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={styles.lockButtonStyle}
                                                            title="锁定"
                                                            onClick={this.lockUtilLesson.bind(
                                                                this,
                                                                courseDetailCard.id
                                                            )}
                                                        >
                                                            <i className={icon.iconfont}>
                                                                &#xe744;
                                                            </i>
                                                        </span>
                                                    ))
                                            }
                                            {courseDetailCard.isBuffer ? null : (
                                                <span
                                                    className={styles.icon + '   ' + disabled}
                                                    title="编辑"
                                                    onClick={this.editCard}
                                                >
                                                    <i className={icon.iconfont}>&#xe63b;</i>
                                                </span>
                                            )}
                                        </span>
                                        {!published && courseDetailCard.type === 1 && (
                                            <span
                                                className={styles.arrange + '   ' + disabled}
                                                title="转待排"
                                                onClick={this.props.handleArrangeCourse}
                                            >
                                                <i className={icon.iconfont}>&#xe7c6;</i>
                                            </span>
                                        )}

                                        {!published && (
                                            <span
                                                className={styles.delete + '   ' + disabled}
                                                title="删除"
                                                onClick={this.deleteCard.bind(
                                                    this,
                                                    courseDetailCard
                                                )}
                                            >
                                                <i className={icon.iconfont}>&#xe739;</i>
                                            </span>
                                        )}
                                        {arrangeModal &&
                                            !showExchangeClassTable &&
                                            !courseDetailCard.isBuffer &&
                                            courseDetailCard.type === 2 && (
                                                <span
                                                    className={styles.arrowRight}
                                                    title="暂缓排课"
                                                    onClick={this.bufferChange}
                                                >
                                                    <Icon type="arrow-right" />
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                )}
                {showEditCourse && (
                    <EditSystemCourse
                        {...this.props}
                        {...this.state}
                        hideSystemModal={this.hideSystemModal}
                        getLessonViewMsg={this.props.getLessonViewMsg}
                    />
                )}
            </div>
        );
    }
}
