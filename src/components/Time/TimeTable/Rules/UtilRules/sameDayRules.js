//同天上规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import { Tabs, Input, message, Spin } from 'antd';
import CommonList from './common/commonList';
import SearchCourse from '../../SearchCourse/index';
import { getIdValueArr } from '../../../../../utils/utils';
import { flatten } from 'lodash';
import { trans, locale } from '../../../../../utils/i18n';

const { TabPane } = Tabs;

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    sameDayStatisticsChecked: state.rules.sameDayStatisticsChecked,
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
            checkedIds: [], //用户选中的id
            isClearChecked: false,
            confirmEditBtn: false, //确认修改按钮的显隐
            editListId: '',
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
                this.getSameDayList(this.state.activeKey);
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
                        this.getSameDayList(this.state.activeKey);
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
                confirmEditBtn: false,
            },
            () => {
                //删除props存储的数据
                const { dispatch } = this.props;
                dispatch({
                    type: 'rules/sameDayStatistics',
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
                this.getSameDayList(activeKey);
            }
        );
    };

    //获取同天上规则列表
    getSameDayList(activeKey) {
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
        const { sameDayStatisticsChecked } = this.props;
        let sameDayCheckedList = getIdValueArr(sameDayStatisticsChecked);
        let courseTitle = '';
        sameDayCheckedList &&
            sameDayCheckedList.length > 0 &&
            sameDayCheckedList.map((el) => {
                let length = el.value.length;
                let classLesson = length > 0 ? el.name + '-' + length + ', ' : '';
                courseTitle += classLesson;
            });
        return courseTitle ? courseTitle + '同天上课' : '';
    };

    //保存用户选中的规则
    saveFormInformation = (id) => {
        const { dispatch, currentVersion, selfId, acRuleFilterParamInputModelList } = this.props;
        console.log('acRuleFilterParamInputModelList', acRuleFilterParamInputModelList);
        const { remark, weightPercent, checkedIds } = this.state;
        let dispatchType = id ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        if (
            (acRuleFilterParamInputModelList.length === 1 &&
                acRuleFilterParamInputModelList[0].acIdList.length <= 1) ||
            acRuleFilterParamInputModelList.length === 0
        ) {
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
        this.setState({
            saveLoading: true,
        });
        dispatch({
            type: dispatchType,
            payload: {
                ...editObj,
                acRuleFilterParamInputModelList,
                baseRuleId: selfId,
                title: acRuleFilterParamInputModelList[0].acShowList[0],
                ruleParameter: JSON.stringify(ruleParameter),
                versionId: currentVersion,
                remark: remark,
                scheduleId: null,
                weightPercentage: Number(weightPercent),
            },
            onSuccess: () => {
                const { getAddRules, getRuleCount, acRuleFilterParamInputModelList } = this.props;
                this.clearAll();
                //同天上规则列表
                this.getSameDayList(this.state.activeKey);
                //已添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //规则统计
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                //清空子组件的checked归为初始状态
                this.setState({
                    isClearChecked: false,
                    checkedIds: [],
                    saveLoading: true,
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
        const { sameDayStatisticsChecked } = this.props;
        let checkedIds = [];
        sameDayStatisticsChecked &&
            sameDayStatisticsChecked.length > 0 &&
            sameDayStatisticsChecked.map((el) => {
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

    //统计用户添加的课程和AC列表 (位置)
    statisticsChecked = (checkedUtil) => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'rules/sameDayStatistics',
            payload: {
                checkedUtil: checkedUtil,
            },
        });
    };

    //编辑之前删除props中存取的值
    clearBeforeEdit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/sameDayStatistics',
            payload: {
                clearStatistics: 'all',
            },
        });
    };

    //编辑规则
    editSameDayRules = (id) => {
        this.clearBeforeEdit();
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id: id,
            },
        }).then(() => {
            const { dispatch, editRuleInformation } = this.props;
            this.setState({
                remark: editRuleInformation && editRuleInformation.remark,
                weightPercent:
                    editRuleInformation && editRuleInformation.weightPercentage.toString(),
                checkedIds:
                    editRuleInformation &&
                    editRuleInformation.acRuleFilterParamInputModelList &&
                    flatten(
                        editRuleInformation.acRuleFilterParamInputModelList.map(
                            (item) => item.acIdList
                        )
                    ), //AC列表id
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
            remark,
            isClearChecked,
            checkedIds,
            confirmEditBtn,
            editListId,
            saveLoading,
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

    emptyAcRuleFilterParamInputModelList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/setAcRuleFilterParamInputModelList',
            payload: [],
        });
    };

    render() {
        const { tabs, ruleListOfTypes } = this.props;
        const { activeKey, controllerFormList, saveLoading } = this.state;
        return (
            <Spin spinning={saveLoading} tip={trans('global.save the rules', '保存规则中')}>
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
                                                    </div>
                                                    <div className={styles.togetherRuleList}>
                                                        {ruleListOfTypes &&
                                                            ruleListOfTypes.length > 0 &&
                                                            ruleListOfTypes.map((item, index) => {
                                                                return (
                                                                    <CommonList
                                                                        currentKey="sameDayRules"
                                                                        getSameDayList={
                                                                            this.getSameDayList
                                                                        }
                                                                        key={item.id}
                                                                        dataSource={item}
                                                                        editSameDayRules={
                                                                            this.editSameDayRules
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
