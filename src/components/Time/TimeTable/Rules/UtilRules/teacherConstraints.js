import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import { Menu, Dropdown, Icon, Switch, Spin } from 'antd';
import icon from '../../../../../icon.less';
import TeacherConstraintsRuleItem from './ruleComponents/teacherConstraintsRuleItem';
import { isEmpty } from 'lodash';

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    editRuleInformation: state.rules.oneRuleInformation, //编辑列表详情
    teacherConstraintsLoading: state.rules.teacherConstraintsLoading, //编辑列表详情
}))
export default class TeacherConstraints extends PureComponent {
    state = {
        dropdownVisible: false,
        activeKey: this.props.activeTabKey,
        addRulesStatus: false,
        defaultRule: {},
        defaultClickStatus: true,
        removeDefaultRuleList: [],
        showConditionList: false,
        currentClickRuleId: '',
    };

    componentDidMount() {
        const { activeKey } = this.state;
        this.getTeacherConstraintsList(activeKey);
        //非指定元素，隐藏显示
        document.addEventListener('click', () => this.changeCondition(false));
    }

    //隐藏必选满足&&尽量满足条件列表
    changeCondition = (showConditionList, id) => {
        this.setState({
            showConditionList,
            currentClickRuleId: id,
        });
    };

    //获取教师限制规则
    getTeacherConstraintsList = (activeKey) => {
        const { dispatch, currentVersion, selfId } = this.props;
        dispatch({
            type: 'rules/ruleListOfTypes',
            payload: {
                versionId: currentVersion,
                baseRuleId: selfId,
                ruleObjectRelationType: activeKey,
            },
        }).then(() => {
            const { ruleListOfTypes } = this.props;
            //找到默认教师规则
            let defaultRuleIndex = ruleListOfTypes.findIndex(
                (item) => item.acRuleFilterParamInputModelList[0]?.teacherTimeRuleDefault
            );
            let removeDefaultRuleList;
            if (defaultRuleIndex === -1) {
                removeDefaultRuleList = [...ruleListOfTypes];
                this.setState({
                    defaultRule: {},
                });
            } else {
                removeDefaultRuleList = ruleListOfTypes.toSpliced(defaultRuleIndex, 1);
                this.setState({
                    defaultRule: ruleListOfTypes[defaultRuleIndex],
                });
            }
            this.setState({
                removeDefaultRuleList,
                defaultClickStatus: defaultRuleIndex === -1,
            });
        });
    };

    menuClick = (e) => {
        let key = e.key;
        this.setState({
            activeKey: key,
            dropdownVisible: false,
        });
        this.getTeacherConstraintsList(key);
    };

    handleVisibleChange = (visible) => {
        this.setState({
            dropdownVisible: visible,
        });
    };

    changeAddRulesStatus = (status) => {
        this.setState({
            addRulesStatus: status,
        });
    };

    changeDefaultClickStatus = (defaultClickStatus) => {
        this.setState({
            defaultClickStatus,
        });
    };

    getAddRulesAndRuleCount = () => {
        const { getAddRules, getRuleCount } = this.props;
        //刷新添加规则列表
        typeof getAddRules == 'function' && getAddRules.call(this);
        //统计数量
        typeof getRuleCount == 'function' && getRuleCount.call(this);
    };

    render() {
        const { tabs, teacherConstraintsLoading, currentVersion } = this.props;
        const {
            dropdownVisible,
            activeKey,
            addRulesStatus,
            defaultRule,
            removeDefaultRuleList,
            defaultClickStatus,
            showConditionList,
            currentClickRuleId,
        } = this.state;

        const menu = (
            <Menu onClick={this.menuClick}>
                {tabs.map((item) => (
                    <Menu.Item key={item.id}>
                        {item.id == 6 ? '教师每天最多上课节数' : '教师每天最多连续上课节数'}
                    </Menu.Item>
                ))}
            </Menu>
        );
        return (
            <Spin spinning={teacherConstraintsLoading} tip="保存规则中">
                <div className={styles.teacherConstraintsWrapper}>
                    <Dropdown overlay={menu} onVisibleChange={this.handleVisibleChange}>
                        <span className={styles.dropdownText}>
                            <span>
                                {activeKey == 6
                                    ? '教师每天最多上课节数'
                                    : '教师每天最多连续上课节数'}
                            </span>
                            <span className={styles.icon}>
                                {dropdownVisible ? <Icon type="up" /> : <Icon type="down" />}
                            </span>
                        </span>
                    </Dropdown>
                    <div className={styles.teacherConstraintsRules}>
                        <span className={styles.text}>
                            默认规则
                            <span className={styles.extraText}>
                                {activeKey == 6
                                    ? '(默认规则对例外规则以外本课表的所有教师生效)'
                                    : '(默认规则对例外规则以外本课表的所有教师生效；被作息中的“中断”类型的时段隔开的课节，系统不视为连续上)'}
                            </span>
                        </span>
                        {defaultClickStatus ? (
                            <div
                                className={styles.defaultClickStatus}
                                onClick={() => this.changeDefaultClickStatus(false)}
                            >
                                点击设置
                            </div>
                        ) : (
                            <TeacherConstraintsRuleItem
                                getTeacherConstraintsList={this.getTeacherConstraintsList}
                                dataSource={defaultRule}
                                activeKey={activeKey}
                                changeLoading={this.changeLoading}
                                currentVersion={currentVersion}
                                ifDefaultSetting={true}
                                changeDefaultClickStatus={this.changeDefaultClickStatus}
                                getAddRulesAndRuleCount={this.getAddRulesAndRuleCount}
                                showConditionList={showConditionList}
                                changeCondition={this.changeCondition}
                                currentClickRuleId={currentClickRuleId}
                            />
                        )}
                    </div>
                    <div className={styles.teacherConstraintsRules}>
                        <div className={styles.exceptionsRulesHeader}>
                            <span className={styles.text}>例外规则</span>
                            <span
                                className={styles.addRules}
                                onClick={() => this.changeAddRulesStatus(true)}
                            >
                                新增规则
                            </span>
                        </div>
                        <div className={styles.exceptionsRuleList}>
                            {addRulesStatus && (
                                <TeacherConstraintsRuleItem
                                    getTeacherConstraintsList={this.getTeacherConstraintsList}
                                    dataSource={{}}
                                    isDefaultRule={false}
                                    activeKey={activeKey}
                                    changeLoading={this.changeLoading}
                                    ifCreateSetting={true}
                                    changeAddRulesStatus={this.changeAddRulesStatus}
                                    currentVersion={currentVersion}
                                    getAddRulesAndRuleCount={this.getAddRulesAndRuleCount}
                                    showConditionList={showConditionList}
                                    changeCondition={this.changeCondition}
                                    currentClickRuleId={currentClickRuleId}
                                />
                            )}
                            {removeDefaultRuleList &&
                                removeDefaultRuleList.length > 0 &&
                                removeDefaultRuleList.map((item, index) => {
                                    return (
                                        <TeacherConstraintsRuleItem
                                            getTeacherConstraintsList={
                                                this.getTeacherConstraintsList
                                            }
                                            dataSource={item}
                                            isDefaultRule={false}
                                            activeKey={activeKey}
                                            changeLoading={this.changeLoading}
                                            currentVersion={currentVersion}
                                            getAddRulesAndRuleCount={this.getAddRulesAndRuleCount}
                                            showConditionList={showConditionList}
                                            changeCondition={this.changeCondition}
                                            currentClickRuleId={currentClickRuleId}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
