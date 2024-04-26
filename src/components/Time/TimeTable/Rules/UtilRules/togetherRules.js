//同时上规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import { Tabs, Input, TreeSelect, message, Spin, Select } from 'antd';
import CommonList from './common/commonList';
import SearchCourse from '../../SearchCourse/index';
import { getIdValueArr } from '../../../../../utils/utils';
import { flatten } from 'lodash';
import { trans, locale } from '../../../../../utils/i18n';

const { TabPane } = Tabs;
const { Option } = Select;

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    courseAllList: state.rules.courseAllList, //版本下的课程
    togetherStatisticsChecked: state.rules.togetherStatisticsChecked,
    editRuleInformation: state.rules.oneRuleInformation,
    acRuleFilterParamInputModelList: state.rules.acRuleFilterParamInputModelList,
}))
export default class TogetherRules extends PureComponent {
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
            confirmEditBtn: false, //确认修改按钮的显隐
            editListId: '',
            searchCourseValue: undefined, //课程查询条件
            saveLoading: false,
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
                this.getTogetherList(this.state.activeKey);
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
                        this.getTogetherList(this.state.activeKey);
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
                confirmEditBtn: false,
                searchCourseValue: undefined,
            },
            () => {
                //删除props存储的数据
                const { dispatch } = this.props;
                dispatch({
                    type: 'rules/togetherStatistics',
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

    //获取同时上课程
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
                this.clearAll();
                this.getTogetherList(activeKey);
            }
        );
    };

    //获取同时上规则列表
    getTogetherList(activeKey) {
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
        const { selectCourse } = this.state;
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
        return courseTitle ? courseTitle + '同时上课' : '';
    };

    //格式化标题--课节
    formatLessonTitle = () => {
        const { staggerStatisticsChecked } = this.props;
        let staggerCheckedList = getIdValueArr(staggerStatisticsChecked);
        let courseTitle = '';
        staggerCheckedList &&
            staggerCheckedList.length > 0 &&
            staggerCheckedList.map((el) => {
                let length = el.value.length;
                let classLesson = length > 0 ? el.name + '-' + length + ', ' : '';
                courseTitle += classLesson;
            });
        return courseTitle ? courseTitle + '同时上课' : '';
    };

    //保存用户选中的规则
    saveFormInformation = (id) => {
        const { dispatch, currentVersion, selfId, acRuleFilterParamInputModelList } = this.props;
        const { activeKey, remark, weightPercent, checkedIds, selectCourse } = this.state;
        let dispatchType = id ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        let ruleParameter = {
            ifIsconsecutive: true,
            minDay: null,
            remark: remark, //备注
            weightPercentage: weightPercent, //权重
        };
        let utilObj = {};
        if (activeKey == 3) {
            //必填校验
            if (selectCourse.length == 0) {
                message.info('请完善信息再保存');
                return false;
            }
            //课程字段
            utilObj.courseIds = selectCourse; //课程id集合
            utilObj.title = this.formatCourseTitle();
        } else if (activeKey == 4) {
            //必填校验
            if (acRuleFilterParamInputModelList.length === 0) {
                message.info('请完善信息再保存');
                return false;
            } else if (
                acRuleFilterParamInputModelList.length === 1 &&
                acRuleFilterParamInputModelList[0].acIdList.length <= 1
            ) {
                message.info('请选择多个课节~');
                return false;
            } else {
                //课节字段
                utilObj.title = acRuleFilterParamInputModelList[0].acShowList[0];
                utilObj.acRuleFilterParamInputModelList = acRuleFilterParamInputModelList;
            }
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
                //同时上规则列表
                this.getTogetherList(this.state.activeKey);
                //已添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //规则统计
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                //清空子组件的checked归为初始状态
                this.setState({
                    isClearChecked: false,
                    checkedIds: [],
                });
                dispatch({
                    type: 'rules/setAcRuleFilterParamInputModelList',
                    payload: [],
                });
                message.success('设置成功~');
            },
        }).then(() => {
            this.setState({
                saveLoading: false,
            });
        });
    };

    //统计用户选择的id
    getCheckedIds = () => {
        const { togetherStatisticsChecked } = this.props;
        let checkedIds = [];
        togetherStatisticsChecked &&
            togetherStatisticsChecked.length > 0 &&
            togetherStatisticsChecked.map((el) => {
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
    };

    //统计用户添加的课程和AC列表
    statisticsChecked = (checkedUtil) => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'rules/togetherStatistics',
            payload: {
                checkedUtil: checkedUtil,
            },
        });
    };

    //编辑之前删除props中存取的值
    clearBeforeEdit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/togetherStatistics',
            payload: {
                clearStatistics: 'all',
            },
        });
    };

    //编辑规则
    editTogetherRules = (id) => {
        this.clearBeforeEdit();
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id: id,
            },
        }).then(() => {
            const { dispatch, editRuleInformation } = this.props;
            const { activeKey } = this.state;
            if (activeKey == 3) {
                //课程回显
                this.setState({
                    selectCourse: editRuleInformation && editRuleInformation.courseIds,
                });
            }
            if (activeKey == 4) {
                this.setState({
                    checkedIds:
                        editRuleInformation &&
                        editRuleInformation.acRuleFilterParamInputModelList &&
                        flatten(
                            editRuleInformation.acRuleFilterParamInputModelList.map(
                                (item) => item.acIdList
                            )
                        ), //AC列表id
                });
                dispatch({
                    type: 'rules/setAcRuleFilterParamInputModelList',
                    payload:
                        editRuleInformation && editRuleInformation.acRuleFilterParamInputModelList,
                });
            }
            this.setState({
                remark: editRuleInformation && editRuleInformation.remark,
                weightPercent:
                    editRuleInformation && editRuleInformation.weightPercentage.toString(),
                confirmEditBtn: true,
                editListId: id, //列表中的id
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
            checkedIds,
            confirmEditBtn,
            editListId,
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
                <div className={styles.remarkArea}>
                    <Input
                        placeholder={trans('global.no more than', '备注（选填，50字以内）')}
                        maxLength={50}
                        className={styles.remarkInput}
                        onChange={this.fillInRemark}
                        value={remark}
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

    //排课v1.3 根据课程筛选列表
    searchCourseList = (value) => {
        this.setState(
            {
                searchCourseValue: value,
            },
            () => {
                //查询列表
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

    render() {
        const { tabs, ruleListOfTypes } = this.props;
        const { activeKey, controllerFormList, searchCourseValue, saveLoading } = this.state;
        let courseGroup = this.formatCourseData();
        return (
            <Spin spinning={saveLoading} tip="保存规则中">
                <div className={styles.togetherRules}>
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
                                                {controllerFormList[item.id] && (
                                                    <div className={styles.rulesForm}>
                                                        {this.renderForm(item)}
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
                                                        {item.id == 3 && (
                                                            <Select
                                                                placeholder={trans(
                                                                    'global.Search courses',
                                                                    '按课程筛选'
                                                                )}
                                                                style={{ width: 140 }}
                                                                value={searchCourseValue}
                                                                onChange={this.searchCourseList}
                                                                optionFilterProp="children"
                                                                showSearch
                                                                allowClear={true}
                                                                filterOption={(input, option) => {
                                                                    return (
                                                                        option.props.children
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
                                                                                    {item.title}
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        )}
                                                    </div>
                                                    <div className={styles.togetherRuleList}>
                                                        {ruleListOfTypes &&
                                                            ruleListOfTypes.length > 0 &&
                                                            ruleListOfTypes.map((item, index) => {
                                                                return (
                                                                    <CommonList
                                                                        currentKey="togetherRules"
                                                                        getTogetherList={
                                                                            this.getTogetherList
                                                                        }
                                                                        key={item.id}
                                                                        dataSource={item}
                                                                        editTogetherRules={
                                                                            this.editTogetherRules
                                                                        }
                                                                        currentTabKey={activeKey}
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
