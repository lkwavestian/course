//通用规则列表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonList.less';
import { Switch, Modal, Tooltip, Icon } from 'antd';
import icon from '../../../../../../icon.less';
import { trans } from '../../../../../../utils/i18n';

export default class RulesList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCondition: false,
            borderStatus: '',
        };
    }

    componentDidMount() {
        //非指定元素，隐藏显示
        document.addEventListener('click', this.hideCondition);
    }

    //设置按钮状态
    switchButtonOpen(item, value) {
        const {
            dispatch,
            getAddRules,
            currentKey,
            getNoScheduleList,
            getTogetherList,
            getIntervalList,
            getStaggerList,
            getSameDayList,
            getSequenceList,
        } = this.props;
        let type = value ? 'rules/rulesEnable' : 'rules/rulesDisables';
        //规则启用与禁用
        dispatch({
            type: type,
            payload: {
                weekRuleId: item.id,
            },
            onSuccess: () => {
                //刷新添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                if (currentKey == 'noScheduleRules') {
                    //刷新不排课规则列表
                    typeof getNoScheduleList == 'function' &&
                        getNoScheduleList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'togetherRules') {
                    //刷新同时上的规则列表
                    typeof getTogetherList == 'function' &&
                        getTogetherList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'staggerRules') {
                    //刷新错开上的规则列表
                    typeof getStaggerList == 'function' &&
                        getStaggerList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'intervalRules') {
                    //刷新间隔上的规则列表
                    typeof getIntervalList == 'function' &&
                        getIntervalList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'sameDayRules') {
                    //刷新同天上的规则列表
                    typeof getSameDayList == 'function' &&
                        getSameDayList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'sequenceRules') {
                    //刷新顺序上的规则列表
                    typeof getSequenceList == 'function' &&
                        getSequenceList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'siteRules') {
                    //刷新场地规则的规则列表
                    typeof getSequenceList == 'function' &&
                        getSequenceList.call(this, this.props.currentTabKey);
                }
            },
        });
    }

    //选择条件
    selectCondition = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showCondition: !this.state.showCondition,
        });
    };

    //隐藏条件
    hideCondition = () => {
        this.setState({
            showCondition: false,
        });
    };

    //确认选择条件--必须满足和尽量满足
    confirmCondition(weightPercentage, item) {
        const {
            dispatch,
            getAddRules,
            currentKey,
            getNoScheduleList,
            getTogetherList,
            getIntervalList,
            getStaggerList,
            getSameDayList,
            getSequenceList,
        } = this.props;
        let ruleParameter = {
            ifIsconsecutive: true,
            weightPercentage: weightPercentage,
        };
        dispatch({
            type: 'rules/weeklyRuleChanges',
            payload: {
                id: item.id,
                weightPercentage: weightPercentage,
                ruleType: item.ruleType,
            },
            onSuccess: () => {
                //刷新添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                if (currentKey == 'noScheduleRules') {
                    //刷新不排课规则列表
                    typeof getNoScheduleList == 'function' &&
                        getNoScheduleList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'togetherRules') {
                    //刷新同时上的规则列表
                    typeof getTogetherList == 'function' &&
                        getTogetherList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'staggerRules') {
                    //刷新错开上的规则列表
                    typeof getStaggerList == 'function' &&
                        getStaggerList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'intervalRules') {
                    //刷新间隔上的规则列表
                    typeof getIntervalList == 'function' &&
                        getIntervalList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'sameDayRules') {
                    //刷新同天上的规则列表
                    typeof getSameDayList == 'function' &&
                        getSameDayList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'sequenceRules') {
                    //刷新顺序上的规则列表
                    typeof getSequenceList == 'function' &&
                        getSequenceList.call(this, this.props.currentTabKey);
                }
            },
        });
    }

    //删除规则
    deleteContent(id) {
        const { clearAll } = this.props;
        let self = this;
        Modal.confirm({
            title: '您确定要删除该规则吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                self.confirmDelete(id);
                clearAll();
            },
        });
    }

    //确认删除
    confirmDelete = (id) => {
        const {
            dispatch,
            getAddRules,
            currentKey,
            getNoScheduleList,
            getTogetherList,
            getIntervalList,
            getStaggerList,
            getRuleCount,
            getSameDayList,
            getSequenceList,
        } = this.props;
        dispatch({
            type: 'rules/ruleToDelete',
            payload: {
                id: id,
            },
            onSuccess: () => {
                //刷新添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //统计数量
                typeof getRuleCount == 'function' && getRuleCount.call(this);
                if (currentKey == 'noScheduleRules') {
                    //刷新不排课规则列表
                    typeof getNoScheduleList == 'function' &&
                        getNoScheduleList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'togetherRules') {
                    //刷新同时上的规则列表
                    typeof getTogetherList == 'function' &&
                        getTogetherList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'staggerRules') {
                    //刷新错开上的规则列表
                    typeof getStaggerList == 'function' &&
                        getStaggerList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'intervalRules') {
                    //刷新间隔上的规则列表
                    typeof getIntervalList == 'function' &&
                        getIntervalList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'sameDayRules') {
                    //刷新同天上的规则列表
                    typeof getSameDayList == 'function' &&
                        getSameDayList.call(this, this.props.currentTabKey);
                } else if (currentKey == 'sequenceRules') {
                    //刷新顺序上的规则列表
                    typeof getSequenceList == 'function' &&
                        getSequenceList.call(this, this.props.currentTabKey);
                }
            },
        });
    };

    //编辑规则
    editContent(id) {
        const {
            currentKey,
            editTogetherRules,
            editStaggerRules,
            editIntervalRules,
            editNoScheduleRules,
            editSameDayRules,
            editSequenceRules,
            editSitesRules,
        } = this.props;
        if (currentKey == 'togetherRules') {
            //编辑同时上规则
            typeof editTogetherRules == 'function' && editTogetherRules(id);
        }
        if (currentKey == 'staggerRules') {
            //编辑错开上规则
            typeof editStaggerRules == 'function' && editStaggerRules(id);
        }
        if (currentKey == 'intervalRules') {
            //编辑间隔上规则
            typeof editIntervalRules == 'function' && editIntervalRules(id);
        }
        if (currentKey == 'noScheduleRules') {
            //编辑不排课规则
            typeof editNoScheduleRules == 'function' && editNoScheduleRules(id);
        }
        if (currentKey == 'sameDayRules') {
            //编辑同天上规则
            typeof editSameDayRules == 'function' && editSameDayRules(id);
        }
        if (currentKey == 'sequenceRules') {
            //编辑顺序上规则
            typeof editSequenceRules == 'function' && editSequenceRules(id);
        }
        if (currentKey == 'siteRules') {
            //编辑场地规则
            typeof editSitesRules == 'function' && editSitesRules(id);
        }
    }

    changeBorderStatus = (e) => {
        console.log('this.props :>> ', this.props);
        const { borderStatus } = this.state;
        const { commonListClick, selectedRuleId } = this.props;
        if (!borderStatus) {
            this.setState({
                borderStatus: 'selectBorder',
            });
        } else {
            this.setState({
                borderStatus: '',
            });
        }
        commonListClick && commonListClick(selectedRuleId);
    };

    getTitle = (dataSource) => {
        const { acRuleFilterParamJson, title, ruleParameter, baseRuleId } = dataSource;
        if (acRuleFilterParamJson) {
            let resArr = [];
            const acRuleFilterParamInputModelList = JSON.parse(acRuleFilterParamJson);
            acRuleFilterParamInputModelList.forEach((item) => {
                item.acShowList?.forEach((acItemStr) => resArr.push(acItemStr));
            });
            if (baseRuleId === 5) {
                const { minDay } = JSON.parse(ruleParameter);
                resArr.push(`间隔时间为${minDay}天`);
            }
            return resArr.join('\n');
        } else {
            return title;
        }
    };

    render() {
        const {
            dataSource,
            currentKey,
            createOrigin,
            ifSelectAll,
            selectedRuleIdList,
            selectedRuleId,
            copyStatus,
        } = this.props;
        const { showCondition, borderStatus } = this.state;
        let switchStatus = dataSource && dataSource.status == 1 ? true : false;
        return (
            <div className={styles.commonListStyle}>
                <div
                    className={styles.commonRuleList}
                    style={{
                        borderColor:
                            selectedRuleIdList &&
                            selectedRuleIdList.includes(selectedRuleId) &&
                            copyStatus
                                ? '#3b6ff5'
                                : '#eee',
                    }}
                    onClick={this.changeBorderStatus}
                >
                    {dataSource.mark == 1 && (
                        <p className={styles.ruleTips}>
                            <i className={icon.iconfont + ' ' + styles.iconStyle}>&#xe642;</i>
                            <span>
                                {trans(
                                    'global.dataSourceTitle',
                                    '作息表发生变动，和节次相关的规则需要重新设置'
                                )}
                            </span>
                        </p>
                    )}
                    <div className={styles.list}>
                        <div className={styles.switchButton}>
                            <Switch
                                size="small"
                                checked={switchStatus}
                                onChange={this.switchButtonOpen.bind(this, dataSource)}
                            />
                        </div>
                        <div className={styles.rulesContent}>
                            <p className={styles.rulesText}>
                                <Tooltip
                                    title={dataSource && dataSource.remark}
                                    placement="bottomLeft"
                                    overlayStyle={{ whiteSpace: 'pre-wrap' }}
                                >
                                    <a>{dataSource && dataSource.remark}</a>
                                </Tooltip>
                            </p>
                            <p className={styles.remark}>
                                <Tooltip
                                    title={this.getTitle(dataSource)}
                                    placement="bottomLeft"
                                    overlayStyle={{ whiteSpace: 'pre-wrap' }}
                                >
                                    <a style={{ webkitBoxOrient: 'vertical' }}>
                                        {dataSource && dataSource.title}
                                    </a>
                                </Tooltip>
                            </p>
                            {dataSource.deletedACIdList?.length > 0 && (
                                <p className={styles.warning}>
                                    <Icon type="warning" theme="filled" />
                                    <span>
                                        {trans(
                                            'global.deletedACIdListChange',
                                            '这条规则涉及的课节有变动，请重新编辑确认规则'
                                        )}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className={styles.conditionList}>
                            <div className={styles.showResult}>
                                {dataSource && dataSource.weightPercentage == '100' && (
                                    <span
                                        className={styles.commonButton + ' ' + styles.necessaryBtn}
                                        onClick={this.selectCondition}
                                    >
                                        {trans('global.Must Satisfy', '必须满足')}
                                    </span>
                                )}
                                {dataSource && dataSource.weightPercentage == '95' && (
                                    <span
                                        className={
                                            styles.commonButton + ' ' + styles.unNecessaryBtn
                                        }
                                        onClick={this.selectCondition}
                                    >
                                        {trans('global.Try to Satisfy', '尽量满足')}
                                    </span>
                                )}
                            </div>
                            {showCondition && (
                                <div className={styles.showConditionList}>
                                    <span
                                        className={styles.commonButton + ' ' + styles.necessaryBtn}
                                        onClick={this.confirmCondition.bind(
                                            this,
                                            '100',
                                            dataSource
                                        )}
                                    >
                                        {trans('global.Must Satisfy', '必须满足')}
                                    </span>
                                    <span
                                        className={
                                            styles.commonButton + ' ' + styles.unNecessaryBtn
                                        }
                                        onClick={this.confirmCondition.bind(this, '95', dataSource)}
                                    >
                                        {trans('global.Try to Satisfy', '尽量满足')}
                                    </span>
                                </div>
                            )}

                            {/* 课程的默认间隔规则 不允许修改 */}
                            {/* 已添加规则列表没有删除、修改按钮 */}
                            {currentKey != 'addRules' && (
                                <Tooltip
                                    title={
                                        createOrigin === 1
                                            ? '默认间隔规则不支持修改和删除，如需调整，可关闭默认间隔规则自行添加'
                                            : ''
                                    }
                                    overlayStyle={{ whiteSpace: 'pre-wrap' }}
                                    arrowPointAtCenter={false}
                                >
                                    <span className={styles.remarkBtn}>
                                        <i
                                            className={
                                                icon.iconfont +
                                                ' ' +
                                                (createOrigin === 1 ? styles.disable : ' ')
                                            }
                                            onClick={this.deleteContent.bind(this, dataSource.id)}
                                        >
                                            &#xe739;
                                        </i>
                                        <i
                                            className={
                                                icon.iconfont +
                                                ' ' +
                                                (createOrigin === 1 ? styles.disable : ' ')
                                            }
                                            onClick={this.editContent.bind(this, dataSource.id)}
                                        >
                                            &#xe63b;
                                        </i>
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
