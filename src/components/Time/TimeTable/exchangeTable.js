//调课换课--课表 双击后渲染的页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, message, Popover, Spin } from 'antd';
import styles from './exchangeTable.less';
import icon from '../../../icon.less';
import { fixedZero, getCourseColor, numMulti, formatTimeSafari } from '../../../utils/utils';
import { isEqual } from 'lodash';

const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

@connect((state) => ({
    clickRoomId: state.timeTable.clickTeacherId, // 点击场地添加一行，场地id
    clickTeacherId: state.timeTable.clickTeacherId,
    ifLoading: state.timeTable.ifLoading, // 点击教师添加一行，教师id
    tableWidthRatio: state.timeTable.tableWidthRatio, //表格宽度比例指数
    tableHeightRatio: state.timeTable.tableHeightRatio, //表格宽度比例指数
    displayType: state.timeTable.displayType, //教师课表只显示班级
}))
class ExchangeTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveHighLight: {},
            visible: false,
            topVisible: false,
            studentGroupId: '',
            isFetchTeacher: false,
            isFetchAddress: false,
            isFetchGroup: false,
            conflictReasonCardInfo: null,
            borderGroupId: '',
            borderUtil: '',
            noRuleId: '', // 点击的教师不规则排课的id
            noRuleVisible: false,
        };
        this.isRepeatFetch = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.studentGroupId) {
            this.setState({
                studentGroupId: nextProps.studentGroupId,
            });
        }
    }

    calculationWeekDate(time) {
        let date = new Date(time || ''),
            day = date.getDay(),
            newWeekArr = [];
        day == 0 && (day = 7);
        week.map((item, index) => {
            let elDate = new Date(time + 24 * 3600 * 1000 * (index + 1 - day));
            newWeekArr.push(
                item + ' ' + fixedZero(elDate.getMonth() + 1) + '-' + fixedZero(elDate.getDate())
            );
        });
        return newWeekArr;
    }

    // 删除自定义中某一条
    closeCustom = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/deleteCustom',
            payload: {
                deleteItem: item.studentGroup.id,
            },
        });
    };

    //渲染周几
    renderWeek = (weekTitle) => {
        const { currentDate } = this.props;
        let currentDay = new Date(formatTimeSafari(currentDate)).getDay();
        return weekTitle.map((item, index) => {
            let colClass =
                currentDay == index + 1
                    ? styles.weekLine + ' ' + styles.weekLineActive
                    : styles.weekLine;
            return (
                <Col className={colClass} key={index}>
                    {item}
                </Col>
            );
        });
    };

    //渲染时间盒子
    renderTimeCol = (weekTitle) => {
        return weekTitle.map((item, index) => {
            return (
                <Col className={styles.timeLine} key={index}>
                    <div>{this.renderTimeDiv('start')}</div>
                    <div>{this.renderTimeDiv('end')}</div>
                </Col>
            );
        });
    };

    //渲染盒子中的时间段
    renderTimeDiv = (type) => {
        const { timeLine } = this.props;
        return timeLine.map((el, order) => {
            if (type == 'start') {
                return <span key={order}>{el.start}</span>;
            } else {
                return <span key={order}>{el.end}</span>;
            }
        });
    };

    //处理场地查询数据 (数据再包装)
    handleAddress = (address) => {
        if (!address || address.length == 0) return [];
        let resultArr = [];
        address.map((item) => {
            let obj = {
                studentGroup: {
                    id: item.playgroundId,
                    name: item.playgroundName,
                },
                resultList: item.resultList,
            };
            resultArr.push(obj);
        });
        return resultArr;
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

    // 点击教师获取在课表中的课程
    getTeacherCourse = (item) => {
        const { isFetchTeacher, studentGroupId } = this.state;
        if (isFetchTeacher) return;
        // 判断课表是否已存在点击教师，防止重复出现
        if (this.judgeRepeat(item.id, item.name)) {
            message.info('课表已存在该老师');
            return;
        }

        const { dispatch, currentVersion } = this.props;
        this.setState(
            {
                isFetchTeacher: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/findTeacherSchedule',
                    payload: {
                        id: currentVersion,
                        teacherIds: [item.id],
                        actionType: 'detail', // 前端自定义属性，确认触发请求的位置
                        groupId: studentGroupId, // 前端自定义属性，确认点击教师属于的班级
                    },
                }).then(() => {
                    this.setState({
                        isFetchTeacher: false,
                    });
                });
            }
        );
    };

    // 点击场地查看场地对应课程
    getAddressCourse = (room) => {
        const { isFetchAddress, studentGroupId } = this.state;
        if (isFetchAddress) return;
        // 判断课表是否已存在点击场地，防止重复出现
        if (this.judgeRepeat(room.id, room.name)) {
            message.info('课表已存在该场地');
            return;
        }
        const { dispatch, currentVersion } = this.props;
        this.setState(
            {
                isFetchAddress: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/findFieldSchedule',
                    payload: {
                        id: currentVersion,
                        playgroundIds: [room.id],
                        actionType: 'detail', // 前端自定义属性，确认触发请求的位置
                        groupId: studentGroupId, // 前端自定义属性，确认点击教师属于的班级
                    },
                }).then(() => {
                    this.setState({
                        isFetchAddress: false,
                    });
                });
            }
        );
    };

    // 点击班级查看对应班级课程
    getGroupCourse(studentGroup) {
        const { isFetchGroup } = this.state;
        if (isFetchGroup) return;
        // 判断课表中添加的班级是否与当前点击的相等，若相等，课表已存在不添加
        if (this.judgeRepeat(studentGroup.id, studentGroup.name)) {
            message.info('课表已存在该班级');
            return;
        }

        const { dispatch, currentVersion } = this.props;
        this.setState(
            {
                isFetchGroup: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/fetchGroupList',
                    payload: {
                        id: currentVersion,
                        groupIds: [studentGroup.id],
                        actionType: 'detail', // 前端自定义属性，确认触发请求的位置
                    },
                }).then(() => {
                    this.setState({
                        isFetchGroup: false,
                    });
                });
            }
        );
    }

    intoView = () => {
        this.tableRow.scrollIntoView();
    };

    showRuleDrawer = (mes) => {
        const { showRulesModal } = this.props;
        typeof showRulesModal == 'function' && showRulesModal(mes);
    };
    // 渲染教师不排课规则
    renderMessageHtml = (util) => {
        return (
            util.ruleMessageList &&
            util.ruleMessageList.length > 0 &&
            util.ruleMessageList.map((item, index) => {
                console.log(item, ';kkitem');
                return (
                    <div className={styles.ruleMessageStyle} title={item}>
                        {item}
                    </div>
                );
            })
        );
    };

    // 渲染冲突原因气泡内容
    renderConflictHtml = (util, groupId, list, type, canSelectItem, gradeId) => {
        const conflictContentModel = this.props.conflictReasonCardInfo;
        return this.props.ifLoading ? (
            <p className={styles.reason}>冲突原因计算中...</p>
        ) : (
            <div className={styles.reason}>
                {/* 所有冲突都没有时，显示暂未找到冲突原因 */}
                {conflictContentModel &&
                conflictContentModel.moveSameGroupLessonCheck &&
                !conflictContentModel.teachers &&
                conflictContentModel.timeEquals &&
                !conflictContentModel.isLock &&
                conflictContentModel.ifSameClass &&
                !conflictContentModel.ifCourseTaken &&
                !conflictContentModel.ifMultipleClass &&
                !conflictContentModel.message &&
                !conflictContentModel.rooms &&
                !conflictContentModel.classConflict &&
                conflictContentModel.isChangedNumber &&
                !conflictContentModel.isBreak ? (
                    <p className={styles.poptitle}>
                        <i className={icon.iconfont}>&#xe788;</i>暂未找到冲突原因
                    </p>
                ) : (
                    <p className={styles.poptitle}>
                        <i className={icon.iconfont}>&#xe788;</i>
                        {type == 'compelExchange'
                            ? '换课存在以下冲突'
                            : type === 1
                            ? '调整到此课节存在以下冲突'
                            : ''}
                    </p>
                )}
                {conflictContentModel &&
                    conflictContentModel.teachers &&
                    conflictContentModel.teachers.length > 0 &&
                    conflictContentModel.teachers.map((tea) => (
                        <p key={tea.id}>
                            <span
                                title={tea.name + tea.englishName}
                                className={styles.reasonTea}
                                onClick={this.getTeacherCourse.bind(this, tea)}
                            >
                                {tea.name + (tea.englishName ? tea.englishName : '')}
                            </span>
                            <span className={styles.timeConflict}>时间冲突</span>
                        </p>
                    ))}
                {conflictContentModel && conflictContentModel.timeEquals ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>课时长度不匹配</span>
                    </p>
                )}
                {conflictContentModel && conflictContentModel.isChangedNumber ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>
                            连堂课只允许和1个连堂或2个单堂换课或等数量课节移动
                        </span>
                    </p>
                )}
                {conflictContentModel && conflictContentModel.isLock ? (
                    <p>
                        <span className={styles.reasonEquals}>此课程已锁定</span>
                    </p>
                ) : (
                    ''
                )}
                {conflictContentModel && conflictContentModel.ifSameClass ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>非同一班级不支持调换课操作</span>
                    </p>
                )}
                {conflictContentModel && conflictContentModel.moveSameGroupLessonCheck ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>学生时间冲突</span>
                    </p>
                )}
                {conflictContentModel && conflictContentModel.ifCourseTaken ? (
                    <p>
                        <span className={styles.reasonEquals}>此课程为已上课程</span>
                    </p>
                ) : (
                    ''
                )}
                {conflictContentModel && conflictContentModel.ifMultipleClass ? (
                    <p>
                        <span className={styles.reasonEquals}>此课程为多班级一起上课</span>
                    </p>
                ) : (
                    ''
                )}
                {conflictContentModel && conflictContentModel.isBreak ? (
                    <p>
                        <span className={styles.reasonEquals}>不符合连堂课的break规则</span>
                    </p>
                ) : (
                    ''
                )}
                {conflictContentModel &&
                    conflictContentModel.message &&
                    conflictContentModel.message.length > 0 &&
                    conflictContentModel.message.map((mes) => (
                        <p key={mes.id}>
                            <span
                                title={mes.name}
                                className={styles.reasonMess}
                                onClick={() => this.noRulesClick(msg)}
                            >
                                {mes.name}
                            </span>
                            <span
                                className={styles.noRules}
                                onClick={this.showRuleDrawer.bind(this, mes)}
                            >
                                {mes.ruleRemark ? mes.ruleRemark : '不排课规则'}
                            </span>
                        </p>
                    ))}
                {conflictContentModel &&
                    conflictContentModel.rooms &&
                    conflictContentModel.rooms.length > 0 &&
                    conflictContentModel.rooms.map((room) => (
                        <p key={room.id}>
                            <span
                                title={room.name}
                                className={styles.reasonRoom}
                                onClick={this.getAddressCourse.bind(this, room)}
                            >
                                {room.name}
                            </span>
                            <span className={styles.roomConflict}>场地冲突</span>
                        </p>
                    ))}
                {conflictContentModel &&
                    conflictContentModel.classConflict &&
                    conflictContentModel.classConflict.length > 0 &&
                    conflictContentModel.classConflict.map((classCon) => (
                        <p key={classCon.id}>
                            <span
                                title={classCon.name}
                                className={styles.reasonRoom}
                                onClick={this.getGroupCourse.bind(this, classCon)}
                            >
                                {classCon.name}
                            </span>
                            <span className={styles.roomConflict}>班级冲突</span>
                        </p>
                    ))}

                {conflictContentModel &&
                    conflictContentModel.nonConflictRooms &&
                    conflictContentModel.nonConflictRooms.length > 0 &&
                    conflictContentModel.nonConflictRooms.map((noRoomItem) => (
                        <p key={noRoomItem.id}>
                            <span
                                title={noRoomItem.name}
                                className={styles.reasonRoom}
                                onClick={this.getAddressCourse.bind(this, noRoomItem)}
                            >
                                {noRoomItem.name}
                            </span>
                            <span className={styles.roomConflict}>场地可用</span>
                        </p>
                    ))}

                {canSelectItem && canSelectItem.canSelect == 2 ? (
                    <div className={styles.bottom}>
                        <p>调整至此位置并将有学生冲突的课节转为待排</p>
                        {/* 课表上的课程 */}
                        <span
                            className={styles.noBtn}
                            onClick={this.courseHide.bind(this, util, util.resultId, groupId, type)}
                        >
                            {' '}
                            否{' '}
                        </span>
                        {/* compelExchange为强制换课 */}
                        <span
                            className={styles.yesBtn}
                            onClick={() =>
                                this.moveCourse(canSelectItem, util, groupId, list, type, gradeId)
                            }
                        >
                            {' '}
                            是{' '}
                        </span>
                    </div>
                ) : (
                    /* :conflictContentModel && (conflictContentModel.teachers && conflictContentModel.teachers.length>0|| 
                    conflictContentModel.ifAddressTimeConflict || conflictContentModel.ifMultipleClass ||
                    conflictContentModel.ifCourseTaken || conflictContentModel.isLock || !conflictContentModel.ifSameClass ||!conflictContentModel.moveSameGroupLessonCheck || !conflictContentModel.isChangedNumber) ? 
                    null 
                    :  */
                    <div className={styles.bottom}>
                        <p>
                            {type == 'compelExchange'
                                ? '是否确认换课'
                                : type === 1
                                ? '确定移至此位置'
                                : ''}
                        </p>
                        {/* 课表上的课程 */}
                        <span
                            className={styles.noBtn}
                            onClick={this.courseHide.bind(this, util, util.resultId, groupId, type)}
                        >
                            {' '}
                            否{' '}
                        </span>
                        {/* compelExchange为强制换课 */}
                        <span
                            className={styles.yesBtn}
                            onClick={() =>
                                this.moveCourse(canSelectItem, util, groupId, list, type, gradeId)
                            }
                        >
                            {' '}
                            是{' '}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    //渲染课程表行
    renderClassRow = () => {
        //需要取数据
        const { scheduleData, saveAddressResult, isHigh, studentId, tableHeightRatio } = this.props;
        let formatAddress = this.handleAddress(saveAddressResult);
        let concatResult = (scheduleData && scheduleData.concat(formatAddress)) || [];
        return concatResult && concatResult.length > 0 ? (
            concatResult.map((item, index) => {
                // 双击待排studentGroupId是双击的课程的studentGroups 的 id
                // item.studentGroup.id 是schedule课表的studentGroup的id
                let highStyle =
                    isHigh || item.studentGroup.view == 'grade'
                        ? styles.itemContent
                        : styles.defaultContent;
                return (
                    <div
                        key={index}
                        ref={(ref) => {
                            if (!ref) return;
                            if (item.studentGroup && item.studentGroup.id == studentId) {
                                this.tableRow = ref;
                                this.intoView();
                            }
                        }}
                        className={highStyle}
                        style={{
                            height:
                                isHigh || item.studentGroup.view == 'grade'
                                    ? `${40 * tableHeightRatio}vh`
                                    : `${10 * tableHeightRatio}vh`,
                        }}
                    >
                        <div className={styles.classList}>
                            {item.studentGroup.canClose && item.studentGroup.id !== studentId && (
                                <span
                                    className={styles.closeCustom}
                                    onClick={this.closeCustom.bind(this, item)}
                                >
                                    <i className={icon.iconfont}>&#xe743;</i>
                                </span>
                            )}

                            <span>{item.studentGroup && item.studentGroup.name}</span>
                        </div>
                        <div className={styles.scheduleList}>
                            <Row className={styles.scheduleDetail}>
                                {this.renderScheduleList(
                                    item.resultList,
                                    item.studentGroup && item.studentGroup.id,
                                    item.studentGroup
                                )}
                            </Row>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className={styles.noScheduleData}>该年级下暂无班级展示</div>
        );
    };

    //渲染课程表行的内容 list:课表上的课程  groupId:年级id，年级视图下每一行的id  studentGroup: 年级数据
    renderScheduleList = (list, groupId, studentGroup) => {
        const {
            resultId,
            move,
            newCanCheckScheduleList,
            studentId,
            isHigh,
            cardUtil,
            timeLine,
            tableWidthRatio,
        } = this.props;
        const conflictContentModel = this.props.conflictReasonCardInfo;
        const { saveHighLight } = this.state;
        let newMove = move ? [...move] : [];
        let newCanCheckSchedule = [...newCanCheckScheduleList];

        let newList = [];
        let view = studentGroup.view == 'teacher' || studentGroup.view == 'address';

        //双击已排课节查找冲突信息
        if (move && move.length) {
            newList = newMove;
        } else if (newCanCheckScheduleList && newCanCheckScheduleList.length) {
            //双击待排课节查找冲突信息
            newCanCheckSchedule.map((item) => {
                newList.push(item);
            });
        }

        return (
            list &&
            list.length > 0 &&
            list.map((item, index) => {
                //处理每周几的数据
                let itemArr = this.formatScheduleItem(item);
                return (
                    <Col key={index}>
                        <div className={styles.courseBox}>
                            {itemArr &&
                                itemArr.length > 0 &&
                                itemArr.map((el, order) => {
                                    return (
                                        el &&
                                        el.length > 0 &&
                                        el.map((util, num) => {
                                            let backColor =
                                                util.type == 0 ||
                                                (util.type == 2 &&
                                                    !util.freeResultId &&
                                                    !util.resultId) ||
                                                (util.type == 1 &&
                                                    !util.freeResultId &&
                                                    !util.resultId)
                                                    ? getCourseColor('作息', 2)
                                                    : (util.type == 2 && !util.resultId) ||
                                                      util.freeType == 2
                                                    ? getCourseColor('活动', 2)
                                                    : getCourseColor(util.name, 2);
                                            let fontColor =
                                                util.type == 0 ||
                                                (util.type == 2 &&
                                                    !util.freeResultId &&
                                                    !util.resultId) ||
                                                (util.type == 1 &&
                                                    !util.freeResultId &&
                                                    !util.resultId)
                                                    ? getCourseColor('作息', 1)
                                                    : (util.type == 2 && !util.resultId) ||
                                                      util.freeType == 2
                                                    ? getCourseColor('活动', 1)
                                                    : getCourseColor(util.name, 1);
                                            let teacherBkg =
                                                util.scheduleFlag === false ? styles.notRule : ''; // 当前版本多个作息，课节地板不展示规则不显示；
                                            let zIndexValue =
                                                !util.freeResultId && !util.resultId
                                                    ? 3
                                                    : (util.type == 2 && !util.resultId) ||
                                                      util.freeType == 2
                                                    ? 4
                                                    : 9; //课程表的层级关系
                                            let addClassName =
                                                studentGroup.view == 'teacher' ||
                                                studentGroup.view == 'address' ||
                                                isHigh ||
                                                studentGroup.view == 'grade'
                                                    ? styles.scheduleCard
                                                    : styles.scheduleCardNoClass;
                                            return (
                                                <div className={styles.action} key={num}>
                                                    <Popover
                                                        onVisibleChange={
                                                            util.scheduleFlag === false
                                                                ? this.noRuleVisibleChange.bind(
                                                                      this,
                                                                      util
                                                                  )
                                                                : this.topHandleVisibleChange.bind(
                                                                      this,
                                                                      util,
                                                                      groupId,
                                                                      studentGroup,
                                                                      'course'
                                                                  )
                                                        }
                                                        visible={
                                                            util.scheduleFlag === false
                                                                ? this.state[
                                                                      `noRuleVisible${util.id}`
                                                                  ]
                                                                : conflictContentModel && !view
                                                                ? this.state[
                                                                      `topVisible${util.resultId}_${groupId}_${util.realLesson}`
                                                                  ]
                                                                : false
                                                        }
                                                        getPopupContainer={(triggerNode) =>
                                                            triggerNode.parentNode
                                                        }
                                                        content={
                                                            util.scheduleFlag === false
                                                                ? this.renderMessageHtml(util)
                                                                : this.renderConflictHtml(
                                                                      util,
                                                                      groupId,
                                                                      list,
                                                                      'compelExchange',
                                                                      _,
                                                                      studentGroup.gradeId
                                                                  )
                                                        }
                                                        trigger="click"
                                                        placement="right"
                                                        overlayStyle={
                                                            util.scheduleFlag === false
                                                                ? {
                                                                      width: '300px',
                                                                      // minHeight : '80px'
                                                                  }
                                                                : ''
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                addClassName + '  ' + teacherBkg
                                                            }
                                                            data-acid={util.acId ? util.acId : ''}
                                                            data-studentgroupid={studentGroup.id}
                                                            key={num}
                                                            onClick={this.handleSignleClick.bind(
                                                                this,
                                                                util,
                                                                util.resultId,
                                                                groupId,
                                                                'course',
                                                                studentGroup
                                                            )}
                                                            style={{
                                                                width:
                                                                    (this.computedWidth(
                                                                        util.detail &&
                                                                            util.acDuration === 1
                                                                            ? util.detail.startTime
                                                                            : util.startTime,
                                                                        util.detail &&
                                                                            util.acDuration === 1
                                                                            ? util.detail.endTime
                                                                            : util.endTime
                                                                    ) /
                                                                        ((timeLine.length - 1) *
                                                                            60)) *
                                                                        100 +
                                                                    '%',
                                                                // boxShadow: (saveHighLight[util.id] == true && studentGroupId == groupId) || util.resultId == resultId ? '2px 5px 13px ' + fontColor : 'none',
                                                                //
                                                                border:
                                                                    newCanCheckScheduleList &&
                                                                    newCanCheckScheduleList.length
                                                                        ? false
                                                                        : this.judgeHightLight(
                                                                              util,
                                                                              groupId,
                                                                              studentGroup
                                                                          ) === 1
                                                                        ? '2px solid rgba(20,118,255,1)'
                                                                        : // detailBorder为true，并且点击的resultId
                                                                        this.state[
                                                                              `topVisible${util.resultId}_${groupId}_${util.realLesson}`
                                                                          ]
                                                                        ? `1px solid ${
                                                                              getCourseColor(
                                                                                  util.name,
                                                                                  1
                                                                              ) || '#3798ff'
                                                                          }`
                                                                        : '1px solid #fff',
                                                                height: (1 / el.length) * 100 + '%',
                                                                top:
                                                                    el.length == 1
                                                                        ? 0
                                                                        : (1 / el.length) *
                                                                              num *
                                                                              100 +
                                                                          '%',
                                                                left:
                                                                    (this.computedLeft(
                                                                        util.startTime,
                                                                        util.endTime
                                                                    ) /
                                                                        ((timeLine.length - 1) *
                                                                            60)) *
                                                                        100 +
                                                                    '%',
                                                                // studentId存取当前换课的班级id
                                                                // util 是课表上遍历出来的所有课程
                                                                background:
                                                                    util.resultId == resultId &&
                                                                    studentId == groupId &&
                                                                    !util.ifLock
                                                                        ? '#1476ff'
                                                                        : util.scheduleFlag ===
                                                                          false
                                                                        ? ''
                                                                        : backColor,
                                                                color:
                                                                    (saveHighLight[util.resultId] ==
                                                                        true &&
                                                                        studentId == groupId) ||
                                                                    (studentId == groupId &&
                                                                        util.resultId == resultId &&
                                                                        !util.ifLock)
                                                                        ? '#fff'
                                                                        : fontColor,
                                                                opacity:
                                                                    studentId == groupId ||
                                                                    studentGroup.canClose
                                                                        ? '1'
                                                                        : '0.25',
                                                                pointerEvents:
                                                                    studentId == groupId ||
                                                                    studentGroup.canClose
                                                                        ? 'auto'
                                                                        : 'none',
                                                                zIndex: zIndexValue,
                                                            }}
                                                            ref={(ref) =>
                                                                (this[`tableRef${util.resultId}`] =
                                                                    ref)
                                                            }
                                                        >
                                                            {util.ifLock && (
                                                                <em
                                                                    className={styles.isLocked}
                                                                ></em>
                                                            )}
                                                            <div className={styles.content}>
                                                                {this.judgeUtilNameContent(
                                                                    studentGroup.view,
                                                                    util,
                                                                    isHigh
                                                                )}

                                                                {((studentGroup.view &&
                                                                    studentGroup.view ==
                                                                        'teacher') ||
                                                                    (studentGroup.view &&
                                                                        studentGroup.view ==
                                                                            'address') ||
                                                                    (studentGroup.view &&
                                                                        studentGroup.view ==
                                                                            'grade') ||
                                                                    (studentGroup.view &&
                                                                        studentGroup.view ==
                                                                            'group') ||
                                                                    isHigh) &&
                                                                    util &&
                                                                    util.studentGroups &&
                                                                    util.studentGroups.map(
                                                                        (group) => {
                                                                            return this.judgeStuGroupNameContent(
                                                                                studentGroup.view,
                                                                                util,
                                                                                group
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </Popover>
                                                    {
                                                        // studentGroupId存取当前换课的班级id
                                                        studentId == groupId &&
                                                            newList &&
                                                            newList.length > 0 &&
                                                            newList.map((item, index) => {
                                                                return (
                                                                    item.weekDay === util.weekDay &&
                                                                    item.lesson ===
                                                                        util.realLesson &&
                                                                    (item.canSelect == 1 ? (
                                                                        <div
                                                                            onClick={this.moveCourse.bind(
                                                                                this,
                                                                                item,
                                                                                util,
                                                                                groupId,
                                                                                list,
                                                                                2,
                                                                                studentGroup.gradeId
                                                                            )}
                                                                            className={
                                                                                styles.placeholderGreen
                                                                            }
                                                                            style={{
                                                                                width:
                                                                                    (this.computedWidth(
                                                                                        util.startTime,
                                                                                        util.endTime
                                                                                    ) /
                                                                                        ((timeLine.length -
                                                                                            1) *
                                                                                            60)) *
                                                                                        100 +
                                                                                    '%',
                                                                                left:
                                                                                    (this.computedLeft(
                                                                                        util.startTime,
                                                                                        util.endTime
                                                                                    ) /
                                                                                        ((timeLine.length -
                                                                                            1) *
                                                                                            60)) *
                                                                                        100 +
                                                                                    '%',
                                                                            }}
                                                                            key={index}
                                                                        >
                                                                            {' '}
                                                                        </div>
                                                                    ) : item.canSelect == 2 ||
                                                                      item.canSelect == 4 ? (
                                                                        <Popover
                                                                            key={index}
                                                                            onVisibleChange={this.conflictHandleVisibleChange.bind(
                                                                                this,
                                                                                util,
                                                                                groupId,
                                                                                'gray'
                                                                            )}
                                                                            visible={
                                                                                conflictContentModel
                                                                                    ? this.state[
                                                                                          `visible${util.resultId}_${groupId}_${util.realLesson}_${util.weekDay}`
                                                                                      ]
                                                                                    : false
                                                                            }
                                                                            className={
                                                                                styles.popover
                                                                            }
                                                                            getPopupContainer={(
                                                                                triggerNode
                                                                            ) =>
                                                                                triggerNode.parentNode
                                                                            }
                                                                            content={this.renderConflictHtml(
                                                                                util,
                                                                                groupId,
                                                                                list,
                                                                                1,
                                                                                item,
                                                                                studentGroup.gradeId
                                                                            )}
                                                                            trigger="click"
                                                                            placement="right"
                                                                        >
                                                                            <div
                                                                                // onClick={this.conflictReason.bind(this,util,groupId,'gray')}
                                                                                className={
                                                                                    styles.placeholderGray
                                                                                }
                                                                                style={{
                                                                                    width:
                                                                                        (this.computedWidth(
                                                                                            util.startTime,
                                                                                            util.endTime
                                                                                        ) /
                                                                                            ((timeLine.length -
                                                                                                1) *
                                                                                                60)) *
                                                                                            100 +
                                                                                        '%',
                                                                                    left:
                                                                                        (this.computedLeft(
                                                                                            util.startTime,
                                                                                            util.endTime
                                                                                        ) /
                                                                                            ((timeLine.length -
                                                                                                1) *
                                                                                                60)) *
                                                                                            100 +
                                                                                        '%',
                                                                                    zIndex: 10,
                                                                                    background:
                                                                                        item.canSelect ==
                                                                                        2
                                                                                            ? '#e9ce91'
                                                                                            : '#e6e6e6',
                                                                                }}
                                                                            >
                                                                                {' '}
                                                                            </div>
                                                                        </Popover>
                                                                    ) : null)
                                                                );
                                                            })
                                                    }
                                                </div>
                                            );
                                        })
                                    );
                                })}
                        </div>
                    </Col>
                );
            })
        );
    };

    //将每周几的结果处理成数组
    formatScheduleItem = (arr) => {
        if (!arr || arr.length == 0) return [];
        let scheduleArr = [];
        let itemArr = [];
        let temp = [arr[0]['startTime'], arr[0]['endTime']];
        for (let i in arr) {
            // 起始结束时间相等为同一时间课程
            if (arr[i]['startTime'] == temp[0] && arr[i]['endTime'] == temp[1]) {
                itemArr.push(arr[i]);
            } else {
                temp = [arr[i]['startTime'], arr[i]['endTime']];
                scheduleArr.push(itemArr);
                itemArr = [arr[i]];
            }
        }
        // 周几 和 节课 相同的课程
        scheduleArr.push(itemArr);
        return scheduleArr;
    };

    //计算宽度
    computedWidth = (start, end) => {
        let s = (start && start.split(':')) || [],
            e = (end && end.split(':')) || [];
        return (e[0] - s[0]) * 60 + parseInt(e[1] - s[1], 10);
    };

    //计算left
    computedLeft = (start, end) => {
        const { timeLine } = this.props;
        let startNum = timeLine[0].start.split(':').map(Number)[0];
        let s = (start && start.split(':')) || [];
        return (s[0] - startNum) * 60 + parseInt(s[1] - 0, 10);
    };

    //将可选课节处理成单个的数组对象[{},{},{}]
    formatExchangeCourse = () => {
        const { newCanChangeCourse } = this.props;
        let resultArr = [];
        if (!newCanChangeCourse || newCanChangeCourse.length <= 0) return [];
        newCanChangeCourse &&
            newCanChangeCourse.length > 0 &&
            newCanChangeCourse.map((item) => {
                if (item.length) {
                    item.map((el) => {
                        resultArr.push(el);
                    });
                } else {
                    resultArr.push(item);
                }
            });
        return resultArr;
    };

    // 待排判断高亮
    willJudgeHightLight = (util, groupId) => {
        const { newCanCheckScheduleList } = this.props;
        const { studentGroupId } = this.state;
        let conflict = false;
        newCanCheckScheduleList &&
            newCanCheckScheduleList.length > 0 &&
            newCanCheckScheduleList.map((item) => {
                if (
                    !item.conflict &&
                    item.weekDay == util.weekDay &&
                    item.lesson == util.realLesson &&
                    studentGroupId == groupId
                ) {
                    conflict = !item.conflict;
                }
            });
        return conflict;
    };

    //判断高亮
    judgeHightLight = (util, groupId, studentGroup) => {
        const { newCanCheckScheduleList, willCardUtil, studentGroupId } = this.props;

        //  处理/api/scheduleResult/newListExchange返回结果
        let changeCourseList = this.formatExchangeCourse();
        let canSelect = false;

        // 已排单堂/连堂
        if (changeCourseList && changeCourseList.length > 0) {
            changeCourseList.map((item) => {
                if (
                    item.canSelect &&
                    item.weekDay == util.weekDay &&
                    item.lesson == util.realLesson &&
                    studentGroupId == groupId &&
                    item.resultId == util.resultId
                ) {
                    if (
                        studentGroup &&
                        studentGroup.view &&
                        (studentGroup.view == 'teacher' || studentGroup.view == 'address')
                    ) {
                        canSelect = false;
                        return;
                    }
                    canSelect = item.canSelect;
                }
            });
            return canSelect;
        }
        // changeCourseList && changeCourseList.length > 0
        // && changeCourseList.map(item => {
        //     if (item.canSelect &&
        //         (item.weekDay == util.weekDay) &&
        //         (item.lesson == util.realLesson) &&
        //         (studentGroupId == groupId) &&
        //         item.resultId == util.resultId ) {
        //             if( studentGroup &&  studentGroup.view && (studentGroup.view == 'teacher' || studentGroup.view == 'address')){
        //                 canSelect=false
        //                 return;
        //             }
        //             canSelect = item.canSelect;
        //     }
        // })
        // 待排判断高亮
        if (willCardUtil && !willCardUtil.resultId) {
            newCanCheckScheduleList &&
                newCanCheckScheduleList.length > 0 &&
                newCanCheckScheduleList.map((item) => {
                    if (
                        item.canSelect &&
                        item.weekDay == util.weekDay &&
                        item.lesson == util.realLesson &&
                        studentGroupId == groupId &&
                        item.resultId == util.resultId
                    ) {
                        canSelect = item.canSelect;
                    }
                });
            return canSelect;
        }

        return canSelect;
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

    // 移动 (课表: 课 => 无 -- correct => 无) （待排: 课 <=> 课 -- correct => ac、 课 => 无--correct => 无）
    exchangeMoveHandle = (item, util, list, type, gradeId, groupId) => {
        const { courseDetail, willCardUtil, isDoubleClick, currentVersion, studentGroupId } =
            this.props;
        //获得点击课节信息
        let newCardUtil = isDoubleClick ? this.props.getWillCardUtil() : this.props.setCardUtil();

        let source = { ...courseDetail };
        let target = { ...util };
        const lessonRelateInfo = {
            sourceGroupIdList: source.studentGroups
                ? source.studentGroups.map((item) => item.id).concat(groupId)
                : [],
            sourceMainTeacherIdList: source.mainTeachers
                ? source.mainTeachers.map((item) => item.id)
                : [],
            sourceAssistantTeacherIdList: source.assistantTeachers
                ? source.assistantTeachers.map((item) => item.id)
                : [],
            sourceRoomId: source.roomId ? [source.roomId] : [],

            targetGroupIdList:
                target.detail && target.detail.studentGroups
                    ? target.detail.studentGroups.map((item) => item.id).concat(groupId)
                    : [],
            targetMainTeacherIdList:
                target.detail && target.detail.mainTeachers
                    ? target.detail.mainTeachers.map((item) => item.id)
                    : [],
            targetAssistantTeacherIdList:
                target.detail && target.detail.assistantTeachers
                    ? target.detail.assistantTeachers.map((item) => item.id)
                    : [],
            targetRoomId: target.detail && target.detail.roomId ? [target.detail.roomId] : [],

            sourceLesson: source.lesson ? source.lesson : target.lesson,
            sourceWeekDay: source.weekDay ? source.weekDay : target.weekDay,

            targetLesson: target.lesson,
            targetWeekDay: target.weekDay,

            layerClassIdList: [
                ...this.getLayerClasslistByAcId(target),
                ...this.getLayerClasslistByAcId(source),
                ...this.getLayerClasslistByDetailId(target),
                ...this.getLayerClasslistByDetailId(source),
            ],
            gradeId: gradeId,
            flag: Boolean(true),
        };

        if (this.isRepeatFetch) {
            return;
        }
        this.isRepeatFetch = true;
        // 待排移动课
        if (!newCardUtil.resultId) {
            this.props
                .dispatch({
                    type: 'timeTable/willSureExchangeCourse',
                    payload: {
                        roomId: courseDetail.roomId,
                        acId: newCardUtil.id,
                        weekDay: util.weekDay,
                        lesson: util.realLesson,
                        baseScheduleId: util.baseScheduleId,
                        turnToWaitIdList: this.getOtherSameTimeCourse(item),
                        nonConflictRooms: item.nonConflictRooms,
                        turnToWaitType: item.canSelect === 1 ? 2 : 1, // 1：转待排-点击强制按钮时传 2：不转待排-点击绿色格子时传
                    },
                    onSuccess: () => {
                        this.props.nextClickClear(); // 控制pointerEvents
                        this.props.showTable('moveChange', lessonRelateInfo); // 刷新课表
                        if (target.resultId) {
                            this.props.getshowAcCourseList(); // 刷线中间列表
                        } else {
                            this.props.getshowAcCourseList(false, true, 'decrease'); // 刷线中间列表
                        }
                        this.props.setNotShowWillCard();
                    },
                })
                .then(() => {
                    this.isRepeatFetch = false;
                });
        } else {
            // 已排移动课
            // type=1点击灰色强制换课，2是点击绿色移动
            // 双击 newCardUtil 单击util

            // 点击选中项取消选中
            if (newCardUtil.id == target.id) {
                this.props.showTable('moveChange');
                return;
            }
            let payload = {};
            payload.resultId = newCardUtil.resultId; // 要移动的结果 id
            payload.moveWeekDay = util.weekDay; // 移动到的weekDay
            payload.moveLesson = util.realLesson; // 移动到的lesson
            payload.versionId = this.props.currentVersion; // 版本 id
            payload.publish = this.props.judgeCurrent(payload.versionId, 'isPublish'); // 版本是否已发布
            payload.exchangeOrMoveType = 2;
            payload.turnToWatitIdList = this.getOtherSameTimeCourse(item);
            payload.nonConflictRooms = item.nonConflictRooms;
            (payload.scheduleDetailId = util.id),
                (payload.conflictInformationInputModel = {
                    versionId: currentVersion,
                    studentGroupId: studentGroupId,
                    weekday: target.weekDay,
                    lesson: target.realLesson,
                    baseScheduleId: target.baseScheduleId,
                    resultId: newCardUtil.resultId ? newCardUtil.resultId : null,
                    acId: newCardUtil.resultId ? newCardUtil.acId || null : newCardUtil.id || null,
                    targetResultId: type != 'gray' ? target.resultId || null : null, // 点击冲突的课程的resultId
                });
            payload.turnToWaitType = item.canSelect === 1 ? 2 : 1; // 1：转待排-点击强制按钮时传 2：不转待排-点击绿色格子时传

            this.props
                .dispatch({
                    type: 'timeTable/finishExchangeCourse',
                    payload,
                    onSuccess: () => {
                        this.props.showTable('moveChange', lessonRelateInfo);
                    },
                })
                .then(() => {
                    this.isRepeatFetch = false;
                });
        }
    };

    // 换课 （课表：课 <=> 课） (ac <=> ac)
    exchangeHandle = (util, groupId, type, gradeId) => {
        const { dispatch, currentVersion, studentGroupId } = this.props;
        let activeList = document.querySelector('#activeClassList');
        let newCardUtil = this.props.setCardUtil(); // 取table里双击课节的信息
        let target = { ...util };
        let source = { ...newCardUtil };

        //单击A课进行调换课操作，又点击A课取消操作
        if (isEqual(target, source)) {
            return;
        }
        const lessonRelateInfo = {
            targetGroupIdList: target.detail.studentGroups
                ? target.detail.studentGroups.map((item) => item.id).concat(groupId)
                : [],
            targetMainTeacherIdList: target.detail.mainTeachers
                ? target.detail.mainTeachers.map((item) => item.id)
                : [],
            targetAssistantTeacherIdList: target.detail.assistantTeachers
                ? target.detail.assistantTeachers.map((item) => item.id)
                : [],
            targetRoomId: target.detail.roomId ? [target.detail.roomId] : [],

            sourceGroupIdList: source.detail.studentGroups
                ? source.detail.studentGroups.map((item) => item.id).concat(groupId)
                : [],
            sourceMainTeacherIdList: source.detail.mainTeachers
                ? source.detail.mainTeachers.map((item) => item.id)
                : [],
            sourceAssistantTeacherIdList: source.detail.assistantTeachers
                ? source.detail.assistantTeachers.map((item) => item.id)
                : [],
            sourceRoomId: source.detail.roomId ? [source.detail.roomId] : [],

            sourceLesson: source.lesson ? source.lesson : target.lesson,
            sourceWeekDay: source.weekDay ? source.weekDay : target.weekDay,
            targetLesson: target.lesson,
            targetWeekDay: target.weekDay,

            layerClassIdList: [
                ...this.getLayerClasslistByAcId(target),
                ...this.getLayerClasslistByAcId(source),
                ...this.getLayerClasslistByDetailId(target),
                ...this.getLayerClasslistByDetailId(source),
            ],
            gradeId: gradeId,
            flag: Boolean(true),
        };
        if (newCardUtil.resultId == util.resultId) {
            this.props.saveDetailId('', 2);
            return;
        }
        // 双击 newCardUtil 单击util
        // 非圈起来课程或空课程return
        // 点击的是眼保健操之类type为0的课程
        if (
            (this.judgeHightLight(util, groupId) !== 1 && type !== 'compelExchange') ||
            (util.type === 1 && !util.resultId) ||
            util.type === 0
        ) {
            return;
        }

        let payload = {};

        // resultExchangeList[ 双击的课程的resultid , 单击换课的课程resultid]
        payload.resultExchangeResultIdList = [newCardUtil.resultId, util.resultId];
        payload.versionId = this.props.currentVersion;
        payload.publish = this.props.judgeCurrent(payload.versionId, 'isPublish');
        payload.exchangeOrMoveType = 1;
        payload.conflictInformationInputModel = {
            versionId: currentVersion,
            studentGroupId: studentGroupId,
            weekday: target.weekDay,
            lesson: target.realLesson,
            baseScheduleId: target.baseScheduleId,
            resultId: source.resultId ? source.resultId : null,
            acId: source.resultId ? source.acId || null : source.id || null,
            targetResultId: type != 'gray' ? target.resultId || null : null, // 点击冲突的课程的resultId
        };
        dispatch({
            type: 'timeTable/finishExchangeCourse',
            payload,
            onSuccess: () => {
                this.props.showTable('clickChange', lessonRelateInfo);
            },
        });
    };

    // 冲突原因
    conflictReason = (util, groupId, type) => {
        // util 是点击那条的信息 newCardUtil 是双击的
        console.log('conflictReason');
        const { dispatch, isDoubleClick } = this.props;
        let newCardUtil = isDoubleClick ? this.props.getWillCardUtil() : this.props.setCardUtil();
        // 点击本身不显示冲突  && 点击空课节的灰色格子显示冲突
        if (newCardUtil.resultId == util.resultId && util.resultId) {
            let source = { ...newCardUtil };
            let target = { ...util };
            const lessonRelateInfo = {
                sourceGroupIdList: source.studentGroups
                    ? source.studentGroups.map((item) => item.id).concat(groupId)
                    : [],
                sourceMainTeacherIdList: source.mainTeachers
                    ? source.mainTeachers.map((item) => item.id)
                    : [],
                sourceAssistantTeacherIdList: source.assistantTeachers
                    ? source.assistantTeachers.map((item) => item.id)
                    : [],
                sourceRoomId: source.roomId ? [source.roomId] : [],

                targetGroupIdList:
                    target.detail && target.detail.studentGroups
                        ? target.detail.studentGroups.map((item) => item.id).concat(groupId)
                        : [],
                targetMainTeacherIdList:
                    target.detail && target.detail.mainTeachers
                        ? target.detail.mainTeachers.map((item) => item.id)
                        : [],
                targetAssistantTeacherIdList:
                    target.detail && target.detail.assistantTeachers
                        ? target.detail.assistantTeachers.map((item) => item.id)
                        : [],
                targetRoomId: target.detail && target.detail.roomId ? [target.detail.roomId] : [],

                sourceLesson: source.lesson ? source.lesson : target.lesson,
                sourceWeekDay: source.weekDay ? source.weekDay : target.weekDay,

                targetLesson: target.lesson,
                targetWeekDay: target.weekDay,

                flag: Boolean(true),
            };
            this.props.showTable('clickSelf', lessonRelateInfo);
            return;
        }
        //type != 1 (说明不是课节 ,点击时不触发接口请求)
        // type=0 是眼保健操之类的课程
        if (util.type !== 1 || util.type === 0) {
            return;
        }
        //  如果点击的是课程圈起来的可调换课程不显示冲突
        if (type == 'course') {
            if (this.judgeHightLight(util, groupId) === 1 || !util.resultId) {
                return;
            }
        }
        // 如果双击的是待排区域，点击课表课程不请求冲突原因
        if (type == 'course' && !newCardUtil.resultId) {
            return;
        }
        return dispatch({
            type: 'timeTable/conflictReasonCard',
            payload: {
                versionId: this.props.currentVersion,
                studentGroupId: this.props.studentGroupId,
                weekday: util.weekDay,
                lesson: util.realLesson,
                baseScheduleId: util.baseScheduleId,
                resultId: newCardUtil.resultId ? newCardUtil.resultId : null,
                acId: newCardUtil.resultId ? newCardUtil.acId || null : newCardUtil.id || null,
                targetResultId: type != 'gray' ? util.resultId || null : null, // 点击冲突的课程的resultId
            },
        });
        // .then(()=>{
        //     const { conflictReasonCardInfo } = this.props;
        //     if (!conflictReasonCardInfo) {
        //         message.error('连堂课暂不支持此功能')
        //     }
        // })
    };

    // 获取相同时间其他课
    getOtherSameTimeCourse = (util) => {
        const { scheduleData, saveAddressResult, studentGroupId } = this.props;
        let formatAddress = this.handleAddress(saveAddressResult);
        let concatResult = (scheduleData && scheduleData.concat(formatAddress)) || [];
        let index = 0;
        concatResult.map((item, i) => {
            if (item.studentGroup.id == studentGroupId) {
                index = i;
            }
        });
        const preGroupResult = concatResult[index].resultList[util.weekDay - 1];
        const idList = [];
        preGroupResult.map((item) => {
            if (item.resultId && item.realLesson == util.lesson && item.weekDay == util.weekDay) {
                idList.push(item.resultId);
            }
        });
        return idList;
    };

    /**
     * item:点击移动结果的格子
     * util：课程所在的格子的数据
     * list:所在班级的课程结果
     * type：移动换课方式
     * **/
    // 移动到可移动课节
    moveCourse(item, util, groupId, list, type, gradeId) {
        if (type == 'compelExchange') {
            // 调换
            this.exchangeHandle(util, groupId, 'compelExchange', gradeId);
        } else {
            // 移动
            this.exchangeMoveHandle(item, util, list, type, gradeId, groupId);
        }
    }

    // 点击不可移动显示冲突原因
    conflictHandleVisibleChange = async (util, groupId, type, visible) => {
        if (visible) {
            await this.conflictReason(util, groupId, type);
        }
        const { conflictReasonCardInfo } = this.props;
        if (!conflictReasonCardInfo) {
            return;
        }
        let newState = { ...this.state };
        newState[`visible${util.resultId}_${groupId}_${util.realLesson}_${util.weekDay}`] = visible;
        this.setState({
            ...newState,
        });
    };

    noRuleVisibleChange = (util, visible) => {
        let newState = { ...this.state };
        newState[`noRuleVisible${util.id}`] = visible;
        this.setState({
            ...newState,
            noRuleId: util.id,
        });
    };
    // 点击不高亮课程显示冲突原因
    topHandleVisibleChange = async (util, groupId, studentGroup, type, visible) => {
        let newCardUtil = this.props.setCardUtil();
        const { borderUtil, borderGroupId } = this.state;
        // 双击待排点击课程不显示冲突
        if (!newCardUtil.resultId) {
            return;
        }
        if (
            studentGroup.view != 'teacher' &&
            studentGroup.view != 'address' &&
            studentGroup.view != 'student' &&
            visible
        ) {
            await this.conflictReason(util, groupId, type);
        }
        const { studentGroupId } = this.state;
        const { conflictReasonCardInfo } = this.props;
        if (!conflictReasonCardInfo) {
            return;
        }
        const { cardUtil } = this.props;
        newCardUtil = this.props.setCardUtil();
        if (
            this.judgeHightLight(util, groupId) === 1 ||
            this.willJudgeHightLight(util, groupId) ||
            !util.resultId ||
            !cardUtil.resultId
        )
            return;
        if (newCardUtil.resultId == util.resultId) {
            return;
        }
        if (this.judgeHightLight(util, groupId) !== 1) {
            let newState = { ...this.state };
            newState[
                `topVisible${borderUtil.resultId}_${borderGroupId}_${borderUtil.realLesson}`
            ] = false;
            newState[`topVisible${util.resultId}_${groupId}_${util.realLesson}`] = visible;
            this.setState({
                ...newState,
                borderUtil: util,
                borderGroupId: groupId,
            });
        }
    };

    // 隐藏头部popover
    courseHide = (util, id, groupId, type) => {
        let newState = { ...this.state };
        if (type == 'compelExchange') {
            newState[`topVisible${id}_${groupId}_${util.realLesson}`] = false;
        } else if (type == 1) {
            newState[`visible${id}_${groupId}_${util.realLesson}_${util.weekDay}`] = false;
        }
        this.setState({
            ...newState,
        });
    };
    // 隐藏底部popover
    grayHide = (util, id, groupId) => {
        let newState = { ...this.state };
        newState[`visible${id}_${groupId}_${util.realLesson}_${util.weekDay}`] = false;
        this.setState({
            ...newState,
        });
    };

    // 关闭教师不规则排课卡片
    closeNotRuleCard = () => {
        this.setState({
            noRuleId: '',
        });
    };

    // 单击调用函数
    handleSignleClick = (util, id, groupId, type, studentGroup) => {
        console.log('handleSignleClick');
        if (util.scheduleFlag == false) {
            this.setState({
                noRuleId: util.id,
            });
            return;
        }
        const { courseDetail } = this.props;
        const { borderUtil, borderGroupId } = this.state;
        if (this.props.isDoubleClick && type === 'course' && !util.resultId) {
            return;
        }
        const { studentGroupId } = this.state;
        let newCardUtil = this.props.setCardUtil(); // 取table里双击课节的信息
        let newState = { ...this.state };
        newState[
            `topVisible${borderUtil.resultId}_${borderGroupId}_${borderUtil.realLesson}`
        ] = false;
        // 非圈起来的并且非空格子的
        if (
            this.judgeHightLight(util, groupId) !== 1 &&
            util.resultId &&
            newCardUtil.resultId != util.resultId
        ) {
            this.props.fetchCourseDetail(id, 1, util, studentGroupId, 'click', studentGroup);
        }

        this.exchangeHandle(util, groupId, _, studentGroup.gradeId || studentGroup.id);
        this.selectCourse(util, id, groupId);
        // this.conflictReason(util,groupId,type)
    };
    //选择可选的课程
    selectCourse(util, utilId, groupId) {
        //canSelect !== 1 不可点击
        if (this.judgeHightLight(util, groupId) !== 1 || !util.resultId) return false;
        //当前要换课不可点击
        const { resultId } = this.props;
        if (utilId == resultId) return false;
        let saveHighLight = {};
        if (!saveHighLight[utilId]) {
            saveHighLight[utilId] = true;
        }
        this.setState({
            saveHighLight: saveHighLight,
        });
    }

    //获取点击课程的详情
    getSelectDetail = (utilId) => {
        let changeCourseList = this.formatExchangeCourse();
        let courseDetail = [];
        changeCourseList &&
            changeCourseList.length > 0 &&
            changeCourseList.map((item) => {
                if (item.id == utilId) {
                    courseDetail.push(item);
                }
            });
        return courseDetail;
    };

    //如何显示课程名
    judgeUtilNameContent = (view, util, isHigh) => {
        const { tableWidthRatio, displayType, currentLang } = this.props;

        let formatUtilName = () => {
            //如果是在老师、场地、年级（宽度比例为1）时，在中文环境下特殊处理（只取第一个字）
            if (
                isHigh ||
                (view && view == 'teacher') ||
                (view && view == 'address') ||
                (view && view == 'grade' && tableWidthRatio === 1)
            ) {
                //如果是英文开头，取字符串全部，否则只取第一个字
                let reg = new RegExp('^[a-zA-Z]');
                let utilName = reg.test(util.name)
                    ? util.name && util.name.split(' ', 1).toString()
                    : util.name && util.name.charAt(0);
                return <span className={styles.utilName}>{utilName}</span>;
            } else {
                return <span className={styles.utilName}>{util.name}</span>;
            }
        };

        //当视图为班级，并且为分层班，并且勾选分层班显示班级班级简称，不显示课程名
        if (
            view &&
            view == 'group' &&
            util.studentGroups &&
            util.studentGroups[0].type === 5 &&
            displayType.includes(7)
        ) {
            return;
        }

        //当视图为教师，并且勾选教师课表只显示班级
        if (displayType.includes(3) && view && view == 'teacher' && util.acId) {
            return;
        }

        //英文环境下，直接返回英文
        if (currentLang === 'en') {
            return <span className={styles.utilName}>{util.eName}</span>;
        }

        //显示课程简称
        if (displayType.includes(6)) {
            if (util.courseShortName) {
                return <span className={styles.utilName}>{util.courseShortName}</span>;
            } else {
                return formatUtilName();
            }
        } else {
            return formatUtilName();
        }
    };

    noRulesClick = (msg) => {
        //type:  1老师不排课 2班级不排课 3课程不排课
        const { type } = msg;
        if (type === 1) {
            this.getTeacherCourse(msg);
        }
        if (type === 2) {
            this.getGroupCourse(msg);
        }
        if (type === 3) {
            return;
        }
    };

    //如何显示班级名
    judgeStuGroupNameContent = (view, util, group) => {
        const { tableWidthRatio, displayType } = this.props;
        //当视图为年级，并且年级课表只显示班级不显示课程时，直接返回
        if (view && view == 'grade' && displayType.includes(5) && util.acId) {
            return;
        }
        //当视图为班级，并且为分层班，并且勾选分层班显示班级简称
        if (view && view == 'group') {
            if (group.type === 5 && displayType.includes(7)) {
                return (
                    <span className={styles.stuGroupName} key={group.name}>
                        {group.groupAbbreviation ? group.groupAbbreviation : group.name}
                    </span>
                );
            } else {
                return;
            }
        }

        return (
            <span className={styles.stuGroupName} key={group.name}>
                {group.groupAbbreviation
                    ? group.groupAbbreviation
                    : tableWidthRatio !== 1
                    ? group.name
                    : this.getNewName(group, util)}
            </span>
        );
    };

    //简化班级名字
    getNewName = (group, util) => {
        // 从这里是把’班‘字删掉
        let nameArray = group.name
            .replace(util.name, '')
            .split('' || '-')
            .toString()
            .split('')
            .filter((item) => item != '年' && item != '级')
            .join('')
            .split(' ');

        let lastElement = nameArray
            .slice(-1)
            .toString()
            .split('')
            .filter((item) => item != '（' && item != '）')
            .slice(0, 2);

        return lastElement.toString().replace(/,/g, '');
    };

    render() {
        const {
            currentDate,
            searchIndex,
            ifExchangeLoading,
            ifMoveLoading,
            timeLine,
            tableWidthRatio,
            isFull,
        } = this.props;
        let weekTitle = this.calculationWeekDate(currentDate);
        let loadingStatus = !ifExchangeLoading && !ifMoveLoading ? false : true;

        //在1950px基础上随tableWidth比例增大
        let minWidth = 1950 * tableWidthRatio + 'px';

        return (
            <Spin spinning={loadingStatus} tip="loading...">
                <div className={styles.scheduleBox} style={{ minWidth }}>
                    <div className={styles.scheduleTitle}>
                        <div className={styles.classBox}>
                            <span>
                                {searchIndex === 0
                                    ? '班级'
                                    : searchIndex === 1
                                    ? '年级'
                                    : searchIndex === 2
                                    ? '学生'
                                    : searchIndex === 3
                                    ? '教师'
                                    : searchIndex === 4
                                    ? '场地'
                                    : searchIndex === 5
                                    ? '自定义'
                                    : '班级'}
                            </span>
                        </div>
                        <div className={styles.weekBox}>
                            <Row className={styles.scheduleClass} type="flex">
                                {this.renderWeek(weekTitle)}
                            </Row>
                            <Row className={styles.scheduleClass} type="flex">
                                {this.renderTimeCol(weekTitle)}
                            </Row>
                        </div>
                    </div>
                    <div
                        className={styles.scheduleMain}
                        ref={(ref) => (this.scheduleMainBox = ref)}
                        style={{ height: isFull ? '90vh' : '80vh' }}
                    >
                        {this.renderClassRow()}
                        <div className={styles.placeholder}></div>
                    </div>
                </div>
            </Spin>
        );
    }
}

export default connect(({ exchangeCourse }) => ({
    exchangeCourse,
}))(ExchangeTable);
