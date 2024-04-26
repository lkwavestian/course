//规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../../../icon.less';
import { Drawer, Tabs } from 'antd';
import AddedRules from './UtilRules/addedRules';
import NoScheduleRules from './UtilRules/noScheduleRule';
import TogetherRules from './UtilRules/togetherRules';
import StaggerRules from './UtilRules/staggerRules';
import IntervalRules from './UtilRules/intervalRules';
import SameDayRules from './UtilRules/sameDayRules';
import SequenceRules from './UtilRules/sequenceRules';
import SiteRules from './UtilRules/siteRules';
import ClassBind from './UtilRules/classBind';
import TeacherConstraints from './UtilRules/teacherConstraints';
import CoursePackage from './UtilRules/coursePackage';

const { TabPane } = Tabs;

@connect((state) => ({
    ruleCount: state.rules.ruleCount,
    addedRulesList: state.rules.hasRulesList,
}))
export default class RulesIndex extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'all',
            noScheduleRulesTab: '',
            isExchange: '',
        };
    }

    componentDidMount() {
        //调用接口
        const { currentVersion } = this.props;
        if (currentVersion) {
            this.getRuleCount();
            this.getAddRules();
        }
        if (this.props.activeTabAndTypeAndId) {
            this.getPositionTab(this.props.activeTabAndTypeAndId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { currentVersion } = this.props;
        if (nextProps.rulesModal != this.props.rulesModal) {
            if (nextProps.rulesModal) {
                //调用接口
                if (currentVersion) {
                    this.getRuleCount();
                    this.getAddRules();
                }
                if (nextProps.activeTabAndTypeAndId) {
                    this.getPositionTab(nextProps.activeTabAndTypeAndId);
                }
            }
        }
    }

    // 获取
    getPositionTab = (activeTabAndTypeAndId) => {
        const newTab = activeTabAndTypeAndId.split('_');
        this.setState({
            activeKey: newTab[0],
            noScheduleRulesTab: newTab[1],
            isExchange: activeTabAndTypeAndId,
        });
    };

    //获取规则统计数量
    getRuleCount() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/ruleCount',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //获取已添加规则列表
    getAddRules = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/hasRulesList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //关闭抽屉
    onClose = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal('rules');
        this.setState({
            activeKey: 'all',
        });
    };

    //切换tab
    switchTabs = (activeKey) => {
        this.setState({
            activeKey: activeKey,
        });
    };

    //渲染右侧主体内容
    renderTabPaneContent = (util) => {
        let content;
        const { isExchange, noScheduleRulesTab } = this.state;
        // eslint-disable-next-line default-case
        switch (util.name) {
            case '不排课':
                content = (
                    <NoScheduleRules
                        {...this.state}
                        {...this.props}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            this.props.activeTabAndTypeAndId
                                ? noScheduleRulesTab
                                : util.ruleObjectStatisticsModelList &&
                                  util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                        isExchange={this.props.activeTabAndTypeAndId}
                        payloadTime={this.props.payloadTime}
                    />
                );
                break;
            case '同时上':
                content = (
                    <TogetherRules
                        {...this.props}
                        {...this.state}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                    />
                );
                break;
            case '错开上':
                content = (
                    <StaggerRules
                        {...this.props}
                        {...this.state}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                    />
                );
                break;
            case '间隔上':
                content = (
                    <IntervalRules
                        {...this.props}
                        {...this.state}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                    />
                );
                break;
            case '同天上':
                content = (
                    <SameDayRules
                        {...this.props}
                        {...this.state}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                    />
                );
                break;
            case '顺序上':
                content = (
                    <SequenceRules
                        {...this.props}
                        {...this.state}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                    />
                );
                break;
            case '场地':
                content = (
                    <SiteRules
                        {...this.props}
                        {...this.state}
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                    />
                );
                break;
            case '教师约束':
                content = (
                    <TeacherConstraints
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                        currentVersion={this.props.currentVersion}
                    />
                );
                break;
            case '课包':
                content = (
                    <CoursePackage
                        selfId={util.id}
                        tabs={util.ruleObjectStatisticsModelList}
                        activeTabKey={
                            util.ruleObjectStatisticsModelList &&
                            util.ruleObjectStatisticsModelList[0].id
                        }
                        getAddRules={this.getAddRules}
                        getRuleCount={this.getRuleCount}
                        currentVersion={this.props.currentVersion}
                        getScheduleId={this.props.getScheduleId}
                        showTable={this.props.showTable}
                    />
                );
                break;
        }
        return content;
    };

    render() {
        const { rulesModal, ruleCount, addedRulesList } = this.props;
        const { activeKey } = this.state;
        return (
            <div className={styles.ruleIndex}>
                <Drawer
                    title={null}
                    closable={false}
                    onClose={this.onClose}
                    visible={rulesModal}
                    // visible={true}
                    placement={'right'}
                    width="620"
                    style={{ zIndex: 102 }}
                >
                    <div className={styles.leftTabBar}>
                        <Tabs tabPosition="left" activeKey={activeKey} onChange={this.switchTabs}>
                            <TabPane tab={`已添加（${addedRulesList.amount || 0}）`} key="all">
                                <AddedRules
                                    {...this.props}
                                    {...this.state}
                                    selfId={'all'}
                                    getAddRules={this.getAddRules}
                                    getRuleCount={this.getRuleCount}
                                />
                            </TabPane>
                            {ruleCount &&
                                ruleCount.length > 0 &&
                                ruleCount.map((item) => {
                                    let content = this.renderTabPaneContent(item);
                                    if (item.name === '顺序上') return;
                                    return (
                                        <TabPane
                                            tab={`${item.name} (${item.amount})`}
                                            key={item.id}
                                        >
                                            {content}
                                        </TabPane>
                                    );
                                })}
                            {
                                <TabPane tab="班级绑定" key="classBind">
                                    <ClassBind {...this.props} {...this.state} />
                                </TabPane>
                            }
                        </Tabs>
                    </div>
                </Drawer>
            </div>
        );
    }
}
