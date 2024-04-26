//顺序上规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import { Tabs, Input, message } from 'antd';
import CommonList from './common/commonList';
import SearchCourse from '../../SearchCourse/index';
import { getIdValueArr } from '../../../../../utils/utils';
import { trans, locale } from '../../../../../utils/i18n';

const { TabPane } = Tabs;

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    sequenceStatisticsChecked: state.rules.sequenceStatisticsChecked,
    editRuleInformation: state.rules.oneRuleInformation,
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
            checkedIds: [], //用户选中的id
            isClearChecked: false,
            confirmEditBtn: false, //确认修改按钮的显隐
            editListId: '',
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
                this.getSequenceList(this.state.activeKey);
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
                        this.getSequenceList(this.state.activeKey);
                    }
                );
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
                confirmEditBtn: false,
            },
            () => {
                //删除props存储的数据
                const { dispatch } = this.props;
                dispatch({
                    type: 'rules/sequenceStatistics',
                    payload: {
                        clearStatistics: 'all',
                    },
                });
                this.setState({
                    isClearChecked: false,
                });
            }
        );
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
                this.getSequenceList(activeKey);
            }
        );
    };

    //获取顺序上规则列表
    getSequenceList(activeKey) {
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

    //格式化标题
    formatTitle = () => {
        const { sequenceStatisticsChecked } = this.props;
        let sequenceCheckedList = getIdValueArr(sequenceStatisticsChecked);
        let courseTitle = '';
        sequenceCheckedList &&
            sequenceCheckedList.length > 0 &&
            sequenceCheckedList.map((el) => {
                let length = el.value.length;
                let classLesson = length > 0 ? el.name + '-' + length + ', ' : '';
                courseTitle += classLesson;
            });
        return courseTitle ? courseTitle + '顺序上课' : '';
    };

    //保存用户选中的规则
    saveFormInformation = (id) => {
        const { dispatch, currentVersion, selfId } = this.props;
        const { remark, weightPercent, checkedIds } = this.state;
        const weekRuleSortAcInputModelList = checkedIds.map((item, index) => {
            let obj = {};
            obj.sort = index + 1;
            obj.acId = item;
            return obj;
        });
        let dispatchType = id ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        if (checkedIds.length <= 1) {
            message.info('请选择多个课节~');
            return false;
        }
        let ruleParameter = {
            ifIsconsecutive: true,
            minDay: null,
            remark: remark, //备注
            weightPercentage: weightPercent, //权重
        };
        let editObj = {};
        if (id) {
            editObj.id = id;
        }
        dispatch({
            type: dispatchType,
            payload: {
                ...editObj,
                baseRuleId: selfId,
                title: this.formatTitle(),
                ruleParameter: JSON.stringify(ruleParameter),
                versionId: currentVersion,
                remark: remark,
                scheduleId: null,
                weightPercentage: Number(weightPercent),
                // activityIds: checkedIds,//AC列表id
                weekRuleSortAcInputModelList, //顺序上与同天上同时上不同点
            },
            onSuccess: () => {
                const { getAddRules, getRuleCount } = this.props;
                this.clearAll();
                //顺序上规则列表
                this.getSequenceList(this.state.activeKey);
                //已添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //规则统计
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                //清空子组件的checked归为初始状态
                this.setState({
                    isClearChecked: false,
                });
            },
        });
    };

    //统计用户选择的id
    getCheckedIds = () => {
        const { sequenceStatisticsChecked } = this.props;
        let checkedIds = [];
        sequenceStatisticsChecked &&
            sequenceStatisticsChecked.length > 0 &&
            sequenceStatisticsChecked.map((el) => {
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
            type: 'rules/sequenceStatistics',
            payload: {
                checkedUtil: checkedUtil,
            },
        });
    };

    //编辑之前删除props中存取的值
    clearBeforeEdit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/sequenceStatistics',
            payload: {
                clearStatistics: 'all',
            },
        });
    };

    //编辑规则
    editSequenceRules = (id) => {
        this.clearBeforeEdit();
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id: id,
            },
        }).then(() => {
            const { editRuleInformation } = this.props;
            this.setState({
                remark: editRuleInformation && editRuleInformation.remark,
                weightPercent:
                    editRuleInformation && editRuleInformation.weightPercentage.toString(),
                // checkedIds: editRuleInformation && editRuleInformation.activityIds,//AC列表id
                checkedIds:
                    editRuleInformation &&
                    editRuleInformation.weekRuleSortAcInputModelList.map((item) => item.acId),
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
            remark,
            isClearChecked,
            checkedIds,
            confirmEditBtn,
            editListId,
        } = this.state;
        return (
            <div className={styles.formContent}>
                <div className={styles.searchCourse}>
                    <SearchCourse
                        statisticsChecked={this.statisticsChecked}
                        getCheckedIds={this.getCheckedIds}
                        menuKey={this.props.activeKey}
                        showEditCheckedIds={checkedIds}
                        {...this.props}
                        {...this.state}
                    />
                    <SearchCourse
                        statisticsChecked={this.statisticsChecked}
                        getCheckedIds={this.getCheckedIds}
                        menuKey={this.props.activeKey}
                        showEditCheckedIds={checkedIds}
                        {...this.props}
                        {...this.state}
                    />
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
                            {trans('global.save', '保存')}
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

    render() {
        const { tabs, ruleListOfTypes } = this.props;
        const { activeKey, controllerFormList } = this.state;
        return (
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
                                                        {trans('global.Rules Added', '已添加规则')}
                                                    </p>
                                                </div>
                                                <div className={styles.togetherRuleList}>
                                                    {ruleListOfTypes &&
                                                        ruleListOfTypes.length > 0 &&
                                                        ruleListOfTypes.map((item, index) => {
                                                            return (
                                                                <CommonList
                                                                    currentKey="sequenceRules"
                                                                    getSequenceList={
                                                                        this.getSequenceList
                                                                    }
                                                                    key={item.id}
                                                                    dataSource={item}
                                                                    editSequenceRules={
                                                                        this.editSequenceRules
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
        );
    }
}
