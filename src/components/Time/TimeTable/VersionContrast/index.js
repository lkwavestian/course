//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../../../icon.less';
import {
    Modal,
    Select,
    Radio,
    DatePicker,
    message,
    Drawer,
    Icon,
    TreeSelect,
    Tooltip,
    Tabs,
    Spin,
} from 'antd';
import moment from 'moment';
import lodash, { isEmpty } from 'lodash';
import { configConsumerProps } from 'antd/lib/config-provider';
import { formatTimeSafari } from '../../../../utils/utils';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const dateFormat = 'YYYY/MM/DD';

import copy from 'copy-to-clipboard';
import { trans, locale } from '../../../../utils/i18n';

@connect((state) => ({
    arrangeDetailList: state.timeTable.arrangeDetailList,
    compareVersionList: state.timeTable.compareVersionList,
    compareVersionResult: state.timeTable.compareVersionResult,
    compareVersionTeacherList: state.timeTable.compareVersionTeacherList,
}))
export default class VersionContrast extends PureComponent {
    constructor(props) {
        super(props);
        const { versionInfo, publishSourse, dispatch } = this.props;
        this.state = {
            selectVisible: false,
            contrastDate: '',
            startTime:
                (versionInfo &&
                    versionInfo.lastPublishedVersion &&
                    versionInfo.lastPublishedVersion.startTime) ||
                '',
            endTime:
                (versionInfo &&
                    versionInfo.lastPublishedVersion &&
                    versionInfo.lastPublishedVersion.endTime) ||
                '',
            versionSourceId: publishSourse && publishSourse.id,
            versionSourceName: versionInfo && this.getVersionName(versionInfo.lastPublishedVersion),
            compareResult: [],
            isCompare: false,
            versionTargetId: versionInfo.id,
            versionTargetName: this.getVersionName(versionInfo),
            isFetch: false,
            sourceStartTime: versionInfo.startTime,
            sourceEndTime: versionInfo.endTime,
            selectType: 1, // 1:变动前， 2：变动后
            gradeValue: [],
            suit: [],
            changeBeforeStartTime:
                versionInfo &&
                versionInfo.lastPublishedVersion &&
                versionInfo.lastPublishedVersion.startTime, // 变动前的时间
            changeAfterStartTime: versionInfo && versionInfo.startTime, // 变动后的默认展示时间
            beforeStartTime: '',
            afterStartTime: '',
            exchangeCourseMessage: '', //存储选中元素信息
            compareType: ['group'],
            compareResultLoading: false,
        };
    }

    componentDidMount() {
        const { publishSourse, publishTarget, versionInfo } = this.props;
        console.log('publishTarget :>> ', publishTarget);
        console.log('publishSourse :>> ', publishSourse);
        // 公布课表中查看相应课表变动
        if (publishSourse && publishTarget) {
            this.setState(
                {
                    versionTargetId: publishTarget.id,
                    versionTargetName: this.getVersionName(publishTarget),
                    versionSourceName: this.getVersionName(publishSourse),
                    startTime: publishSourse.startTime,
                    endTime: publishSourse.endTime,
                },
                () => {
                    this.handleConfirmCompare('group', 'teacher');
                }
            );
            return;
        }
        console.log('versionInfo :>> ', versionInfo);

        if (versionInfo.lastPublishedVersion) {
            const versionSource = versionInfo.lastPublishedVersion;
            this.setState(
                {
                    versionSourceId: versionSource.id,
                    versionSourceName: this.getVersionName(versionSource),
                    startTime: versionSource.startTime,
                    endTime: versionSource.endTime,
                },
                () => {
                    this.handleConfirmCompare('group', 'teacher');
                }
            );
            return;
        }

        this.setState({
            startTime: this.props.start,
            endTime: this.props.end,
        });
    }

    getCompareList = () => {
        const { dispatch, versionId } = this.props;
        const { startTime, endTime } = this.state;
        dispatch({
            type: 'timeTable/getCompareVersion',
            payload: {
                startTime: new Date(formatTimeSafari(startTime)).getTime(),
                endTime: new Date(formatTimeSafari(endTime)).getTime(),
                versionId,
            },
        });
    };

    /* handleCancel = () => {
    this.resumeStyle(); //清除样式会出问题？
  }; */

    showSelectContrastModal = (type) => {
        this.getCompareList();
        this.setState({
            selectVisible: true,
            selectType: type,
        });
    };

    handleSelectCancel = () => {
        this.setState({
            selectVisible: false,
        });
    };

    handleSelectOk = () => {
        const { versionTargetName, versionSourceName } = this.state;
        if (versionTargetName !== versionSourceName) {
            this.handleConfirmCompare('group', 'teacher');
        }

        this.setState({
            selectVisible: false,
        });
    };

    //时间格式化
    getLocalTime(time, type) {
        if (!time) return false;
        var time = moment(time),
            y = time.year(),
            m = time.month() + 1,
            day = time.date();
        return y + '/' + m + '/' + day;
    }

    //获得当前的00:00:00和23:59:59时间
    getAlldayTime(start, end) {
        let currentDayStart = this.getLocalTime(new Date(formatTimeSafari(start)), 2);
        let currentDayEnd = this.getLocalTime(new Date(formatTimeSafari(end)), 2);
        /*  let startTime = new Date(currentDayStart + ' ' + '00:00:00').getTime();
        let endTime = new Date(currentDayEnd + ' ' + '23:59:59').getTime(); */
        let startTime = moment(currentDayStart).valueOf();
        console.log('startTime', startTime);
        let endTime = moment(currentDayEnd).valueOf() + 86399000;
        // let endTime = moment(currentDayEnd).valueOf();
        console.log('endTime', endTime);
        this.setState(
            {
                startTime: startTime,
                endTime: endTime,
            },
            () => {
                this.getCompareList();
            }
        );
    }

    //根据日历定位到当前周
    getCurrentWeek(nowTime) {
        let now = new Date(formatTimeSafari(nowTime)),
            nowStr = now.getTime(),
            day = now.getDay() != 0 ? now.getDay() : 7,
            oneDayLong = 24 * 60 * 60 * 1000;
        let MondayTime = nowStr - (day - 1) * oneDayLong,
            SundayTime = nowStr + (7 - day) * oneDayLong;
        let monday = new Date(formatTimeSafari(MondayTime)).getTime(),
            sunday = new Date(formatTimeSafari(SundayTime)).getTime();
        this.getAlldayTime(monday, sunday);
    }

    onDateChange = (date, dateString) => {
        const { selectType } = this.state;
        if (selectType == 'versionTarget') {
            this.setState({
                changeAfterStartTime: dateString,
            });
        }
        if (selectType == 'versionSource') {
            this.setState({
                changeBeforeStartTime: dateString,
            });
        }
        let str = dateString.replace(/-/g, '/');
        let dateChange = new Date(str).getTime();
        this.getCurrentWeek(dateChange);
    };

    versionListChange = (value, item) => {
        const { selectType } = this.state;
        this.setState({
            [selectType + 'Id']: value,
            [selectType + 'Name']: item.props.title,
        });
    };

    handleConfirmCompare = (...showTypeArr) => {
        console.log('showTypeArr :>> ', showTypeArr);
        const { dispatch, versionId } = this.props;
        const { versionSourceId, versionTargetId, gradeValue, compareType } = this.state;
        if (!versionTargetId || !versionSourceId) {
            message.info('请选择对比版本');
            return;
        }
        let groupIdString = gradeValue.join();
        this.setState(
            {
                isCompare: true,
                selectVisible: false,
            },
            () => {
                if (showTypeArr.includes('group')) {
                    this.setState({
                        compareResultLoading: true,
                    });
                    dispatch({
                        type: 'timeTable/getCompareVersionResult',
                        payload: {
                            sourceVersionId: versionSourceId,
                            targetVersionId: versionTargetId,
                            groupIdString,
                        },
                        onSuccess: () => {
                            const { compareVersionResult } = this.props;
                            this.setState({
                                compareResult: compareVersionResult,
                                selectVisible: false,
                                isCompare: false,
                                isFetch: true,
                            });
                        },
                    }).then(() => {
                        this.setState({
                            isCompare: false,
                            compareResultLoading: false,
                        });
                    });
                }
                if (showTypeArr.includes('teacher')) {
                    this.setState({
                        compareResultLoading: true,
                    });
                    dispatch({
                        type: 'timeTable/getCompareVersionTeacher',
                        payload: {
                            sourceVersionId: versionSourceId,
                            targetVersionId: versionTargetId,
                            filterGroupIdString: groupIdString,
                        },
                        onSuccess: () => {
                            this.setState({
                                selectVisible: false,
                                isCompare: false,
                                isFetch: true,
                            });
                        },
                    }).then(() => {
                        this.setState({
                            isCompare: false,
                            compareResultLoading: false,
                        });
                    });
                }
            }
        );
    };
    //处理年级
    formatGradeData = (gradeList) => {
        if (!gradeList || gradeList.length < 0) return [];
        let gradeGroup = [];
        gradeList.map((item) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.ename,
                key: item.id + item.groupName,
                value: item.id,
                // children: this.formatClassData(item.studentGroupList)
            };
            gradeGroup.push(obj);
        });
        return gradeGroup;
    };

    formatGrade = (gradeList) => {
        if (!gradeList || gradeList.length < 0) return;
        let gradeData = [];
        gradeList.map((item, index) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.englishName,
                value: item.gradeId,
                key: item.gradeId,
                children: item.studentGroupList && this.formatGradeData(item.studentGroupList),
            };
            gradeData.push(obj);
        });
        return gradeData;
    };
    changeGrade = (value) => {
        const { compareType } = this.state;
        this.setState(
            {
                gradeValue: value,
            },
            () => {
                this.handleConfirmCompare('group', 'teacher');
            }
        );
    };

    findCompareVOList = (compareVOList, targetMessage) => {
        for (let i = 0; i < compareVOList.length; ++i) {
            for (let j = 0; j < compareVOList[i].compareDTOList.length; ++j) {
                // debugger;
                if (
                    compareVOList[i].compareDTOList[j].compareMessage
                        .replace('\n', ' ')
                        .trimRight()
                        .replace('→  ', '→ ') === targetMessage
                ) {
                    let targetCompareDToList = compareVOList[i].compareDTOList[j];
                    return [
                        targetCompareDToList.sourceResult.lesson,
                        targetCompareDToList.sourceResult.weekDay,
                        targetCompareDToList.targetResult.lesson,
                        targetCompareDToList.targetResult.weekDay,
                        compareVOList[i].studentGroupList[0].id,
                    ];
                }
            }
        }
    };

    //恢复样式
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
    highLightLesson = (message) => {
        //通过退出调换课按钮判断是否在调换课状态下

        if (!document.getElementById('exitExchange') && !lodash.isEmpty(this.state.compareResult)) {
            //取目标id元素存储其样式
            this.resumeStyle();

            if (message.sourceResult) {
                const {
                    groupIdList, //两个班级共同上一节课
                    weekDay,
                    courseSort,
                } = message.sourceResult;

                if (courseSort) {
                    !lodash.isEmpty(groupIdList) &&
                        groupIdList.forEach((groupId) => {
                            const sourceEle = document.getElementById(
                                `data-${groupId}-${courseSort}-${weekDay}`
                            );

                            sourceEle && sourceEle.classList.add('sourceEle');
                            sourceEle &&
                                sourceEle.scrollIntoView({
                                    behavior: 'smooth',
                                });
                        });
                }
            }

            if (message.targetResult) {
                const { groupIdList, weekDay, courseSort } = message.targetResult;

                if (courseSort) {
                    !lodash.isEmpty(groupIdList) &&
                        groupIdList.forEach((groupId) => {
                            const targetEle = document.getElementById(
                                `data-${groupId}-${courseSort}-${weekDay}`
                            );

                            targetEle && targetEle.classList.add('targetEle');
                            targetEle &&
                                targetEle.scrollIntoView({
                                    behavior: 'smooth',
                                });
                        });
                }
            }
        }
    };

    getRecordMessage = (message) => {
        return (
            //数据结构形式：
            <div
                className={styles.message}
                tabIndex="-1"
                onClick={() => this.highLightLesson(message)}
            >
                {locale() !== 'en' ? message.compareMessage : message.compareEnglishMessage}
            </div>
        );
    };

    compareTypeChange = (value) => {
        this.setState({
            compareType: [value],
        });
    };

    copyCompareTeacher = () => {
        const { compareVersionTeacherList } = this.props;
        let nameStr = compareVersionTeacherList.map((item) => item.teacherName).join('|');
        copy(nameStr);
        message.success('复制成功');
    };

    copyCompareList = () => {
        const { compareVersionTeacherList } = this.props;
        let listStr = compareVersionTeacherList
            .map((item) => {
                return (
                    item.teacherName +
                    '|' +
                    (typeof this.getCompareDTOListStr(item.compareDTOList) === 'object'
                        ? this.getCompareDTOListStr(item.compareDTOList).join(' ; ')
                        : this.getCompareDTOListStr(item.compareDTOList))
                );
            })
            .join('\n');
        copy(listStr);
        message.success('复制成功');
    };

    getCompareDTOListStr = (compareDTOList) => {
        if (compareDTOList.length === 0) return [];
        if (compareDTOList.length === 1)
            return compareDTOList[0].compareMessage.replace('（', '(').replace('）', ')');
        if (compareDTOList.length > 1)
            return compareDTOList.map(
                (item, index) =>
                    `${index + 1}.${item.compareMessage.replace('（', '(').replace('）', ')')}`
            );
    };

    getVersionName = (versionItem) => {
        if (versionItem) {
            return `${versionItem.systemVersionNumber ? versionItem.systemVersionNumber : ''}${
                versionItem.createType === 0 ? '' : '系统调课'
            } ${versionItem.name}`;
        } else return '';
    };

    render() {
        const {
            versionContrastVisible,
            compareVersionList,
            currentVersionName,
            versionInfo,
            compareVersionTeacherList,
        } = this.props;
        const {
            selectVisible,
            startTime,
            endTime,
            compareResult,
            isCompare,
            versionTargetName,
            isFetch,
            versionSourceName,
            sourceStartTime,
            sourceEndTime,
            gradeValue,
            suit,
            changeAfterStartTime,
            changeBeforeStartTime,
            compareType,
            compareResultLoading,
        } = this.state;
        let gradeList = compareResult.gradeStudentGroupModels;
        const studentGroupProps = {
            treeDefaultExpandAll: true,
            maxTagCount: 5,
            treeData: this.formatGrade(gradeList),
            placeholder: '全部班级',
            onChange: this.changeGrade,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            disabled: false,
            style: {
                minWidth: 140,
                maxWidth: 180,
                marginLeft: 10,
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
        };
        const visibleStyle = versionContrastVisible ? styles.showPopover : styles.hidePopover;

        return (
            <div className={styles.versionContrast + ' ' + visibleStyle}>
                {/* 对比选择 */}
                <div className={styles.btnAndInfo}>
                    <span className={styles.info}>
                        <span className={styles.left}>
                            <span className={styles.infoItem}>
                                <span className={styles.label}>
                                    {trans('global.Current Schedule', '变动后')}：
                                </span>
                                <span
                                    className={styles.text}
                                    onClick={this.showSelectContrastModal.bind(
                                        this,
                                        'versionTarget'
                                    )}
                                >
                                    {/* （{this.getLocalTime(sourceStartTime)} - {this.getLocalTime(sourceEndTime)}） */}
                                    <Tooltip
                                        title={
                                            <span>
                                                {this.getLocalTime(changeAfterStartTime)}
                                                &nbsp;&nbsp;
                                                {versionTargetName}
                                            </span>
                                        }
                                        placement="top"
                                    >
                                        <span className={styles.info}>
                                            {this.getLocalTime(changeAfterStartTime)}&nbsp;&nbsp;
                                            {versionTargetName}
                                        </span>
                                    </Tooltip>
                                    <span
                                        onClick={this.showSelectContrastModal.bind(
                                            this,
                                            'versionTarget'
                                        )}
                                        className={styles.edit}
                                    >
                                        <i className={icon.iconfont}>&#xe781;</i>
                                    </span>
                                </span>
                            </span>
                            <span className={styles.infoItem}>
                                <span className={styles.label}>
                                    {trans('global.Original Change', '变动前')}：
                                </span>
                                <span
                                    className={styles.text}
                                    onClick={this.showSelectContrastModal.bind(
                                        this,
                                        'versionSource'
                                    )}
                                >
                                    {/* 体验优化-课表变动，在变动前无版本时 鼠标移动上去的气泡不需要展示 */}
                                    {changeBeforeStartTime && versionSourceName ? (
                                        <Tooltip
                                            title={
                                                <span>
                                                    {this.getLocalTime(changeBeforeStartTime)}
                                                    &nbsp;&nbsp;
                                                    {versionSourceName}
                                                </span>
                                            }
                                            placement="top"
                                        >
                                            <span className={styles.info}>
                                                {this.getLocalTime(changeBeforeStartTime)}
                                                &nbsp;&nbsp;
                                                {versionSourceName}
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <span>
                                            <span className={styles.info}>
                                                {this.getLocalTime(changeBeforeStartTime)}
                                                &nbsp;&nbsp;
                                                {versionSourceName}
                                            </span>
                                        </span>
                                    )}

                                    <span
                                        onClick={this.showSelectContrastModal.bind(
                                            this,
                                            'versionSource'
                                        )}
                                        className={styles.edit}
                                    >
                                        <i className={icon.iconfont}>&#xe781;</i>
                                    </span>
                                </span>
                            </span>
                        </span>
                        <span className={styles.connect}></span>
                        {isCompare ? (
                            <span className={styles.btn + '  ' + styles.dis}>对比</span>
                        ) : (
                            <span
                                className={styles.btn}
                                onClick={() => this.handleConfirmCompare(...compareType)}
                            >
                                {trans('global.Compare', '对比')}
                            </span>
                        )}
                    </span>
                </div>

                {/* 对比结果 */}
                <Spin spinning={compareResultLoading}>
                    <div className={styles.record}>
                        <div className={styles.recordHeader}>
                            <div className={styles.leftPart}>
                                <span className={styles.range}>班级范围</span>
                                <TreeSelect {...studentGroupProps}></TreeSelect>
                            </div>

                            <span>
                                {trans('global.extraContentChanges', '共{$num}条变动', {
                                    num:
                                        compareResult && compareResult.compareCount
                                            ? compareResult.compareCount
                                            : '0',
                                })}
                            </span>
                        </div>

                        {!isEmpty(compareResult) || !isEmpty(compareVersionTeacherList) ? (
                            <Tabs
                                tabBarExtraContent={
                                    compareType[0] === 'teacher' ? (
                                        <div className={styles.copyTextList}>
                                            <span
                                                className={styles.copyText}
                                                onClick={this.copyCompareTeacher}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Icon type="copy" />
                                                <span>
                                                    {trans(
                                                        'global.Copy the changed',
                                                        '复制教师姓名'
                                                    )}
                                                </span>
                                            </span>
                                            <span
                                                className={styles.copyText}
                                                onClick={this.copyCompareList}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Icon type="copy" />
                                                <span>复制变动详情</span>
                                            </span>
                                        </div>
                                    ) : (
                                        ''
                                    )
                                }
                                defaultActiveKey="group"
                                onChange={this.compareTypeChange}
                                tabBarGutter={0}
                            >
                                <TabPane
                                    tab={trans('global.Display by Classes', '按班级展示')}
                                    key="group"
                                >
                                    <div className={styles.items}>
                                        <div className={styles.results}>
                                            {compareResult &&
                                                compareResult.compareVOList &&
                                                compareResult.compareVOList.map((item) => {
                                                    return (
                                                        <div className={styles.result}>
                                                            <span className={styles.resHeader}>
                                                                <span className={styles.groupName}>
                                                                    {item.groupName}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.chiefTutorList
                                                                    }
                                                                >
                                                                    {item.chiefTutorList?.map(
                                                                        (item) => (
                                                                            <span>{item.name}</span>
                                                                        )
                                                                    )}
                                                                </span>
                                                            </span>
                                                            {item &&
                                                                item.compareDTOList &&
                                                                item.compareDTOList.map((message) =>
                                                                    this.getRecordMessage(message)
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane
                                    tab={trans('global.Display by Teachers', '按教师展示')}
                                    key="teacher"
                                >
                                    <div className={styles.items}>
                                        <div className={styles.results}>
                                            {compareVersionTeacherList &&
                                                compareVersionTeacherList &&
                                                compareVersionTeacherList.map((item) => {
                                                    return (
                                                        <div className={styles.result}>
                                                            <span className={styles.groupName}>
                                                                {locale() !== 'en'
                                                                    ? item.teacherName
                                                                    : item.teacherEnName}
                                                            </span>
                                                            {item &&
                                                                item.compareDTOList &&
                                                                item.compareDTOList.map((message) =>
                                                                    this.getRecordMessage(message)
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        ) : isFetch ? (
                            <span className={styles.emptyText}>
                                {trans('global.isFetchTitle', '暂未找到当前课表和已选课表的差异。')}
                            </span>
                        ) : (
                            ''
                        )}
                    </div>
                </Spin>

                {selectVisible && (
                    <Modal
                        className={styles.selectContrastModal}
                        visible={selectVisible}
                        footer={null}
                        onCancel={this.handleSelectCancel}
                        title={trans('global.Select class schedule', '选择课表')}
                        width="300px"
                    >
                        <div className={styles.timePicker}>
                            <span className={styles.timeText}>
                                {this.getLocalTime(startTime)} - {this.getLocalTime(endTime)}
                            </span>
                            <DatePicker
                                onChange={this.onDateChange}
                                style={{ width: '240px' }}
                                className={styles.dateStyle}
                                allowClear={false}
                                defaultValue={moment(this.getLocalTime(startTime), dateFormat)}
                            />
                        </div>
                        <div className={styles.versionName}>
                            <Select
                                onChange={this.versionListChange}
                                style={{ width: '240px' }}
                                placeholder={trans('charge.pleaseSelect', '请选择')}
                            >
                                {compareVersionList &&
                                    compareVersionList.length > 0 &&
                                    compareVersionList.map((item, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                value={item.id}
                                                title={this.getVersionName(item)}
                                            >
                                                {this.getVersionName(item)}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>
                        <div className={styles.btn}>
                            <span className={styles.cancel} onClick={this.handleSelectCancel}>
                                {trans('global.cancel', '取消')}
                            </span>
                            <span className={styles.confirm} onClick={this.handleSelectOk}>
                                {trans('global.confirm', '确认')}
                            </span>
                        </div>
                    </Modal>
                )}
                <span className={styles.arrow}></span>
            </div>
        );
    }
}
