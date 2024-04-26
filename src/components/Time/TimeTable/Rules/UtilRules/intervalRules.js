//间隔上规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import {
    Tabs,
    Input,
    TreeSelect,
    InputNumber,
    message,
    Select,
    Spin,
    Checkbox,
    Tooltip,
} from 'antd';
import CommonList from './common/commonList';
import SearchCourse from '../../SearchCourse';
import { getIdValueArr } from '../../../../../utils/utils';
import { flatten } from 'lodash';
import icon from '../../../../../icon.less';
import { trans, locale } from '../../../../../utils/i18n';

const { TabPane } = Tabs;
const { Option } = Select;

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    courseAllList: state.rules.courseAllList, //版本下的课程
    intervalStatisticsChecked: state.rules.intervalStatisticsChecked,
    editRuleInformation: state.rules.oneRuleInformation,
    acRuleFilterParamInputModelList: state.rules.acRuleFilterParamInputModelList,
}))
export default class IntervalRules extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '',
            controllerFormList: {},
            showConditionList: false,
            weightPercent: '100',
            remark: '',
            selectCourse: [], //选择课程
            checkedIds: [], //用户选中的id
            isClearChecked: false,
            intervalTime: 0, //间隔时间
            confirmEditBtn: false,
            editListId: '',
            searchCourseValue: undefined,
            saveLoading: false,
            ruleType: null,
            ruleTypeArray: [],
            isShowAdd: false,
        };
    }

    componentDidMount() {
        this.setState(
            {
                activeKey: this.props.activeTabKey && this.props.activeTabKey.toString(),
            },
            () => {
                let controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[this.state.activeKey] = true;
                this.setState({
                    controllerFormList: controllerFormList,
                });
                this.getIntervalList(this.state.activeKey);
                this.getCourseAllList();
                this.emptyAcRuleFilterParamInputModelList();
            }
        );
        //非指定元素，隐藏显示
        document.addEventListener('click', this.hideCondition);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey != this.props.activeKey) {
            if (nextProps.activeKey == nextProps.selfId) {
                this.setState(
                    {
                        activeKey: nextProps.activeTabKey && nextProps.activeTabKey.toString(),
                    },
                    () => {
                        let controllerFormList = Object.assign({}, this.state.controllerFormList);
                        controllerFormList[this.state.activeKey] = true;
                        this.setState({
                            controllerFormList: controllerFormList,
                        });
                        this.clearAll();
                        this.getIntervalList(this.state.activeKey);
                        this.getCourseAllList();
                    }
                );
                this.emptyAcRuleFilterParamInputModelList();
            }
        }
    }

    //清空
    clearAll = () => {
        this.setState(
            {
                checkedIds: [],
                showConditionList: false,
                weightPercent: '100',
                remark: '',
                isClearChecked: true, //清空子组件的checked
                selectCourse: [],
                intervalTime: 0,
                confirmEditBtn: false,
                searchCourseValue: undefined,
                ruleType: null,
                ruleTypeArray: [],
            },
            () => {
                //删除props存储的数据
                const { dispatch } = this.props;
                dispatch({
                    type: 'rules/intervalStatistics',
                    payload: {
                        clearStatistics: 'all',
                    },
                });
                this.setState({
                    isClearChecked: false,
                });
                this.emptyAcRuleFilterParamInputModelList();
            }
        );
    };

    //获取间隔上课程
    getCourseAllList() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/courseAllList',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //格式化课程
    formatCourseData = () => {
        const { courseAllList } = this.props;
        if (!courseAllList || courseAllList.length <= 0) return [];
        let courseData = [];
        courseAllList.map((item) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.englishName,
                key: item.id,
                value: item.id,
            };
            courseData.push(obj);
        });
        return courseData;
    };

    //选择课程
    changeCourse = (value) => {
        const { dispatch, currentVersion } = this.props;
        if (value.length == 0) {
            this.setState({
                selectCourse: [],
            });
            return false;
        }
        //校验课程是否同作息--根据课程查询作息id
        dispatch({
            type: 'rules/courseAcquisition',
            payload: {
                versionId: currentVersion,
                courseIdList: value,
            },
            onSuccess: () => {
                this.setState({
                    selectCourse: value,
                });
            },
        });
    };

    //切换tabs
    changeTabs = (activeKey) => {
        this.setState({
            isShowAdd: false,
        });
        this.clearAll();
        this.setState(
            {
                activeKey: activeKey,
                controllerFormList: {},
            },
            () => {
                const controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[activeKey] = true;
                this.setState({
                    controllerFormList: controllerFormList,
                });
                this.getIntervalList(activeKey);
            }
        );
    };

    //获取间隔上规则列表
    getIntervalList(activeKey) {
        const { dispatch, currentVersion, selfId } = this.props;
        dispatch({
            type: 'rules/ruleListOfTypes',
            payload: {
                versionId: currentVersion,
                baseRuleId: selfId,
                ruleObjectRelationType: activeKey,
            },
        });
    }

    //选择必须满足&&尽量满足的条件
    showSelectCondition = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showConditionList: true,
        });
    };

    //隐藏必选满足&&尽量满足条件列表
    hideCondition = () => {
        this.setState({
            showConditionList: false,
        });
    };

    //选择权重
    selectWeightPercent = (value) => {
        this.setState({
            weightPercent: value,
        });
    };

    //填写备注
    fillInRemark = (e) => {
        if (e.target.value && e.target.value.length > 50) {
            message.info('备注不能太长哦~');
            return false;
        }
        this.setState({
            remark: e.target.value,
        });
    };

    //格式化标题--课程
    formatCourseTitle = () => {
        let courseData = this.formatCourseData();
        const { selectCourse, intervalTime } = this.state;
        let courseTitle = '';
        courseData.map((el) => {
            selectCourse &&
                selectCourse.length > 0 &&
                selectCourse.map((item) => {
                    if (item == el.value) {
                        courseTitle += el.title + ', ';
                    }
                });
        });
        return courseTitle
            ? courseTitle +
                  '对应学生组间隔上课，间隔时间为' +
                  intervalTime +
                  '天' +
                  ',' +
                  this.getRuleTypeTitle()
            : '';
    };

    getRuleTypeTitle = () => {
        const { ruleType } = this.state;
        if (ruleType === 2) {
            return '分层课和常规课不同天';
        }
        if (ruleType === 3) {
            return '连堂课和大课不同天';
        }
        if (ruleType === 4) {
            return '分层课和常规课不同天, 连堂课和大课不同天';
        }
        return '';
    };

    //格式化标题--课节
    formatLessonTitle = () => {
        const { intervalStatisticsChecked } = this.props;
        let intervalStatisticsList = getIdValueArr(intervalStatisticsChecked);
        const { intervalTime } = this.state;
        let courseTitle = '';
        intervalStatisticsList &&
            intervalStatisticsList.length > 0 &&
            intervalStatisticsList.map((el) => {
                let length = el.value.length;
                let classLesson = length > 0 ? el.name + '-' + length + '个课节, ' : '';
                courseTitle += classLesson;
            });
        return courseTitle ? courseTitle + '分开上课，间隔时间为' + intervalTime + '天' : '';
    };

    //保存用户选中的规则
    saveFormInformation = (id) => {
        const { dispatch, currentVersion, selfId, acRuleFilterParamInputModelList } = this.props;
        const {
            activeKey,
            remark,
            weightPercent,
            checkedIds,
            selectCourse,
            intervalTime,
            ruleType,
        } = this.state;
        let dispatchType = id ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        //必填校验
        if (intervalTime === '') {
            message.info('请选择最小间隔时间');
            return false;
        }
        if (activeKey == '3') {
            if (selectCourse.length == 0) {
                message.info('请完善信息再保存');
                return false;
            }
        }
        if (activeKey == '4') {
            if (acRuleFilterParamInputModelList.length === 0) {
                message.info('请完善信息再保存');
                return false;
            }
            if (
                acRuleFilterParamInputModelList.length === 1 &&
                acRuleFilterParamInputModelList[0].acIdList.length <= 1
            ) {
                message.info('请选择多个课节~');
                return false;
            }
        }
        let ruleParameter = {
            ifIsconsecutive: true,
            minDay: intervalTime, //间隔时间
            remark: remark, //备注
            weightPercentage: weightPercent, //权重
        };
        let utilObj = {};
        if (activeKey == 3) {
            //课程
            utilObj.courseIds = selectCourse; //课程id集合
            utilObj.title = this.formatCourseTitle();
            utilObj.ruleType = ruleType;
        } else if (activeKey == 4) {
            //课节
            utilObj.acRuleFilterParamInputModelList = acRuleFilterParamInputModelList;
            utilObj.title = `${acRuleFilterParamInputModelList[0].acShowList[0]},间隔时间为${intervalTime}天`;
        }
        let editObj = {};
        if (id) {
            editObj.id = id;
        }
        this.setState({
            saveLoading: true,
        });
        dispatch({
            type: dispatchType,
            payload: {
                ...editObj,
                baseRuleId: selfId,
                ruleParameter: JSON.stringify(ruleParameter),
                versionId: currentVersion,
                remark: remark,
                scheduleId: null,
                weightPercentage: Number(weightPercent),
                ...utilObj,
            },
            onSuccess: () => {
                const { getAddRules, getRuleCount } = this.props;
                this.clearAll();
                //间隔上规则列表
                this.getIntervalList(this.state.activeKey);
                //已添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //规则统计
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                //清空子组件的checked归为初始状态
                if (activeKey == 4) {
                    this.setState({
                        isClearChecked: false,
                        checkedIds: [],
                    });
                    dispatch({
                        type: 'rules/setAcRuleFilterParamInputModelList',
                        payload: [],
                    });
                }
                // locale()!=='en'?message.success(utilObj&&utilObj.title):''
                message.success('设置成功~');
                this.setState({
                    isShowAdd: false,
                });
            },
        }).then(() => {
            this.setState({
                saveLoading: false,
                ruleType: null,
                ruleTypeArray: [],
                isShowAdd: false,
            });
        });
    };

    //统计用户选择的id
    getCheckedIds = (arr) => {
        const { intervalStatisticsChecked } = this.props;
        let checkedIds = [];
        intervalStatisticsChecked &&
            intervalStatisticsChecked.length > 0 &&
            intervalStatisticsChecked.map((el) => {
                el.value &&
                    el.value.map((item) => {
                        checkedIds.push(item);
                    });
            });
        this.setState({
            checkedIds: checkedIds,
        });
        return checkedIds;
    };

    //取消，清空form表单
    handleCancel = (id) => {
        this.clearAll();
        this.setState({
            isShowAdd: false,
        });
    };

    //统计用户添加的课程和AC列表
    statisticsChecked = (checkedUtil) => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'rules/intervalStatistics',
            payload: {
                checkedUtil: checkedUtil,
            },
        });
    };

    //选择间隔时间
    changeCourseInterval = (value) => {
        this.setState({
            intervalTime: value,
            ruleType: null,
            ruleTypeArray: [],
        });
    };

    //编辑之前删除props中存取的值
    clearBeforeEdit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/intervalStatistics',
            payload: {
                clearStatistics: 'all',
            },
        });
    };

    //编辑规则
    editIntervalRules = (id) => {
        this.clearBeforeEdit();
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id: id,
            },
        }).then(() => {
            this.changeShowStatus();
            const { dispatch, editRuleInformation } = this.props;
            const { activeKey } = this.state;
            if (activeKey == 3) {
                //课程回显
                this.setState({
                    selectCourse: editRuleInformation && editRuleInformation.courseIds,
                });
            }
            if (activeKey == 4) {
                //课节回显
                this.setState({
                    checkedIds:
                        editRuleInformation &&
                        editRuleInformation.acRuleFilterParamInputModelList &&
                        flatten(
                            editRuleInformation.acRuleFilterParamInputModelList.map(
                                (item) => item.acIdList
                            )
                        ), //AC列表id,
                });
            }
            this.setState({
                ruleTypeArray:
                    editRuleInformation &&
                    editRuleInformation.ruleType &&
                    this.getRuleTypeArrayByRuleType(editRuleInformation.ruleType),
                ruleType: editRuleInformation.ruleType && editRuleInformation.ruleType,
                remark: editRuleInformation && editRuleInformation.remark,
                weightPercent:
                    editRuleInformation && editRuleInformation.weightPercentage.toString(),
                intervalTime:
                    editRuleInformation &&
                    editRuleInformation.ruleParameter &&
                    JSON.parse(editRuleInformation.ruleParameter).minDay,
                confirmEditBtn: true,
                editListId: id, //列表中的id
            });
            dispatch({
                type: 'rules/setAcRuleFilterParamInputModelList',
                payload: editRuleInformation && editRuleInformation.acRuleFilterParamInputModelList,
            });
        });
    };

    //Form表单
    renderForm = (item) => {
        const {
            showConditionList,
            weightPercent,
            selectCourse,
            remark,
            intervalTime,
            checkedIds,
            confirmEditBtn,
            editListId,
            ruleTypeArray,
            activeKey,
        } = this.state;
        const courseProps = {
            treeData: this.formatCourseData(),
            value: selectCourse,
            placeholder: trans('global.Search or select courses', '搜索或选择课程'),
            onChange: this.changeCourse,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 406,
            },
            dropdownStyle: {
                maxHeight: 300,
                overflow: 'auto',
            },
        };
        return (
            <div className={styles.formContent}>
                <div className={styles.searchCourse}>
                    {item.name == '课程' && <TreeSelect {...courseProps} />}
                    {item.name == '课节' && (
                        <SearchCourse
                            statisticsChecked={this.statisticsChecked}
                            getCheckedIds={this.getCheckedIds}
                            menuKey={this.props.activeKey}
                            showEditCheckedIds={checkedIds}
                            {...this.props}
                            {...this.state}
                        />
                    )}
                </div>
                <div className={styles.intervalTime}>
                    <span>{trans('global.Minimum Interval', '最小间隔时间')}：</span>
                    <InputNumber
                        min={0}
                        value={intervalTime}
                        onChange={this.changeCourseInterval}
                    />
                    {trans('global.days', '天')}
                </div>
                {intervalTime === 0 && activeKey == 3 && (
                    <div style={{}}>
                        <Checkbox.Group onChange={this.diffDayChange} value={ruleTypeArray}>
                            <Checkbox value={2}>
                                {trans('global.stratified class', '分层课和常规课不同天')}
                            </Checkbox>
                            <Checkbox value={3} style={{ marginLeft: 0 }}>
                                {trans('global.double lessons', '连堂课和大课不同天')}
                            </Checkbox>
                        </Checkbox.Group>
                    </div>
                )}

                <div className={styles.remarkArea}>
                    <Input
                        placeholder={trans('global.no more than', '备注（选填，50字以内）')}
                        value={remark}
                        maxLength={50}
                        className={styles.remarkInput}
                        onChange={this.fillInRemark}
                    />
                    <div className={styles.conditionList}>
                        <div className={styles.showResult}>
                            {weightPercent == '100' ? (
                                <span
                                    className={styles.commonButton + ' ' + styles.necessaryBtn}
                                    onClick={this.showSelectCondition}
                                >
                                    {trans('global.Must Satisfy', '必须满足')}
                                </span>
                            ) : (
                                <span
                                    className={styles.commonButton + ' ' + styles.unNecessaryBtn}
                                    onClick={this.showSelectCondition}
                                >
                                    {trans('global.Try to Satisfy', '尽量满足')}
                                </span>
                            )}
                        </div>
                        {showConditionList && (
                            <div className={styles.showConditionList}>
                                <span
                                    className={styles.commonButton + ' ' + styles.necessaryBtn}
                                    onClick={this.selectWeightPercent.bind(this, '100')}
                                >
                                    {trans('global.Must Satisfy', '必须满足')}
                                </span>
                                <span
                                    className={styles.commonButton + ' ' + styles.unNecessaryBtn}
                                    onClick={this.selectWeightPercent.bind(this, '95')}
                                >
                                    {trans('global.Try to Satisfy', '尽量满足')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.operButton}>
                    {confirmEditBtn ? (
                        <span
                            className={styles.saveBtn}
                            onClick={this.saveFormInformation.bind(this, editListId)}
                        >
                            {trans('global.confirm', '确认')}
                        </span>
                    ) : (
                        <span
                            className={styles.saveBtn}
                            onClick={this.saveFormInformation.bind(this, '')}
                        >
                            {trans('global.save', '保存')}
                        </span>
                    )}

                    <span
                        className={styles.cancelBtn}
                        onClick={this.handleCancel.bind(this, item.id)}
                    >
                        {trans('global.cancel', '取消')}
                    </span>
                </div>
            </div>
        );
    };

    //排课v1.3 根据课程搜索列表
    searchCourseList = (value) => {
        this.setState(
            {
                searchCourseValue: value,
            },
            () => {
                const { dispatch, currentVersion, selfId } = this.props;
                const { activeKey } = this.state;
                dispatch({
                    type: 'rules/ruleListOfTypes',
                    payload: {
                        versionId: currentVersion,
                        baseRuleId: selfId,
                        ruleObjectRelationType: activeKey,
                        objectIdList: value,
                    },
                });
            }
        );
    };

    emptyAcRuleFilterParamInputModelList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/setAcRuleFilterParamInputModelList',
            payload: [],
        });
    };

    diffDayChange = (value) => {
        if (value.length === 0) {
            this.setState({
                ruleType: null,
            });
        }

        if (value.length === 1) {
            this.setState({
                ruleType: value[0],
            });
        }
        if (value.length === 2) {
            this.setState({ ruleType: 4 });
        }
        this.setState({
            ruleTypeArray: value,
        });
    };

    getRuleTypeArrayByRuleType = (ruleType) => {
        if (ruleType === 2 || ruleType === 3) return [ruleType];
        if (ruleType === 4) return [2, 3];
        else return [];
    };

    changeShowStatus = () => {
        console.log('123', 123);
        this.setState({
            isShowAdd: true,
        });
    };

    render() {
        const { tabs, ruleListOfTypes } = this.props;
        const { activeKey, controllerFormList, searchCourseValue, saveLoading, isShowAdd } =
            this.state;
        let courseGroup = this.formatCourseData();
        return (
            <Spin spinning={saveLoading} tip={trans('global.save the rules', '保存规则中')}>
                <div className={styles.intervalRules}>
                    <div>
                        <Tabs tabPosition="top" activeKey={activeKey} onChange={this.changeTabs}>
                            {tabs &&
                                tabs.length > 0 &&
                                tabs.map((item, index) => {
                                    return (
                                        <TabPane
                                            tab={`${item.name}（${item.amount}）`}
                                            key={`${item.id}`}
                                        >
                                            <div className={styles.ruleContainer}>
                                                {isShowAdd ? (
                                                    <>
                                                        {item.id == 3 && (
                                                            <div className={styles.ruleTips}>
                                                                <p>
                                                                    “间隔上-课程”规则表示所选课程各个班的课节之间的最少间隔天数。您可以通过该规则，实现课程在周内分散分布。当选择多个课程时，会按照每个班级分组，将每个班级的所选课程课节分散上课。需注意：当设置此类规则时，需确保（上课次数+间隔天数*（上课次数-1））不超过周实际可用天数。举例：
                                                                </p>
                                                                <p>
                                                                    ①某课程每周上2次课，希望两次课至少隔1天，可以设置该课程间隔1天
                                                                </p>
                                                                <p>
                                                                    ②某课程每周上5次课，希望每天上1次，可以设置该课程间隔0天
                                                                </p>
                                                            </div>
                                                        )}
                                                        {item.id == 4 && (
                                                            <div className={styles.ruleTips}>
                                                                <p>
                                                                    “间隔上-课节”规则中的间隔天数表示所选的课节之间的最少间隔天数。天数的规则和“间隔上-课程”相同。
                                                                </p>
                                                            </div>
                                                        )}
                                                        {controllerFormList[item.id] && (
                                                            <div className={styles.rulesForm}>
                                                                {this.renderForm(item)}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div
                                                        className={styles.addPlus}
                                                        onClick={() => this.changeShowStatus()}
                                                    >
                                                        <i className={icon.iconfont}>&#xe75a;</i>
                                                    </div>
                                                )}

                                                <div className={styles.showAddedRules}>
                                                    <div className={styles.searchCondition}>
                                                        <p className={styles.addRulesTitle}>
                                                            {trans(
                                                                'global.Rules Added',
                                                                '已添加规则'
                                                            )}
                                                        </p>
                                                        {item.id === 3 && (
                                                            <Select
                                                                placeholder={trans(
                                                                    'global.Search courses',
                                                                    '按课程筛选'
                                                                )}
                                                                style={{ width: 140 }}
                                                                value={searchCourseValue}
                                                                onChange={this.searchCourseList}
                                                                showSearch
                                                                allowClear={true}
                                                                filterOption={(input, option) => {
                                                                    return (
                                                                        option.props.children?.props?.title
                                                                            .toLowerCase()
                                                                            .indexOf(
                                                                                input.toLowerCase()
                                                                            ) >= 0
                                                                    );
                                                                }}
                                                            >
                                                                {courseGroup &&
                                                                    courseGroup.length > 0 &&
                                                                    courseGroup.map(
                                                                        (item, index) => {
                                                                            return (
                                                                                <Option
                                                                                    value={
                                                                                        item.value
                                                                                    }
                                                                                    key={item.value}
                                                                                >
                                                                                    <Tooltip
                                                                                        title={
                                                                                            item.title
                                                                                        }
                                                                                    >
                                                                                        <span>
                                                                                            {
                                                                                                item.title
                                                                                            }
                                                                                        </span>
                                                                                    </Tooltip>
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={styles.intervalRuleList}
                                                        style={{
                                                            height: isShowAdd ? '40vh' : '75vh',
                                                        }}
                                                    >
                                                        {ruleListOfTypes &&
                                                            ruleListOfTypes.length > 0 &&
                                                            ruleListOfTypes.map((item, index) => {
                                                                return (
                                                                    <CommonList
                                                                        currentKey="intervalRules"
                                                                        createOrigin={
                                                                            item.createOrigin
                                                                        }
                                                                        getIntervalList={
                                                                            this.getIntervalList
                                                                        }
                                                                        key={item.id}
                                                                        dataSource={item}
                                                                        editIntervalRules={
                                                                            this.editIntervalRules
                                                                        }
                                                                        currentTabKey={activeKey}
                                                                        emptyAcRuleFilterParamInputModelList={
                                                                            this
                                                                                .emptyAcRuleFilterParamInputModelList
                                                                        }
                                                                        clearAll={this.clearAll}
                                                                        {...this.props}
                                                                    />
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>
                                    );
                                })}
                        </Tabs>
                    </div>
                </div>
            </Spin>
        );
    }
}
