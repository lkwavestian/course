//通用规则列表
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './teacherConstraintsRuleItem.less';
import { Switch, Modal, Tooltip, Icon, InputNumber, message } from 'antd';
import icon from '../../../../../../icon.less';
import { trans } from '../../../../../../utils/i18n';
import SelectTeacherAndOrg from '../../../FreedomCourse/common/selectTeacherAndOrg';
import { isEmpty } from 'lodash';

@connect((state) => ({
    editRuleInformation: state.rules.oneRuleInformation, //编辑列表详情
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
}))
export default class TeacherConstraintsRuleItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showWeightPercentageList: false,

            //如果是新建默认规则、新建例外规则或者是编辑规则，editStatus初始为true
            editStatus: false,
            count: 0,
            weightPercentage: 100,
            teacherIdList: [],
        };
    }

    componentDidMount() {
        const { ifDefaultSetting, dataSource, ifCreateSetting } = this.props;
        if (dataSource.id) {
            this.setState({
                editStatus: false,
            });
        } else {
            if (ifDefaultSetting || ifCreateSetting) {
                this.setState({
                    editStatus: true,
                });
            }
        }
    }

    getTeacherConstraintsList = () => {
        const { getTeacherConstraintsList, activeKey } = this.props;
        //刷新教师限制列表
        typeof getTeacherConstraintsList == 'function' && getTeacherConstraintsList(activeKey);
    };

    getAddRulesAndRuleCount = () => {
        const { getAddRulesAndRuleCount } = this.props;
        typeof getAddRulesAndRuleCount == 'function' && getAddRulesAndRuleCount();
    };

    //设置按钮状态
    switchButtonOpen = (item, value) => {
        const { dispatch } = this.props;
        let type = value ? 'rules/rulesEnable' : 'rules/rulesDisables';
        //规则启用与禁用
        dispatch({
            type: type,
            payload: {
                weekRuleId: item.id,
            },
            onSuccess: () => {
                this.getTeacherConstraintsList();
            },
        });
    };

    //确认选择条件--必须满足和尽量满足
    changeWeightPercentage = (weightPercentage, id, ruleType) => {
        const { dispatch } = this.props;
        const { editStatus } = this.state;

        this.setState({
            showWeightPercentageList: false,
        });
        if (editStatus) {
            this.setStateFn('weightPercentage', weightPercentage);
        } else {
            dispatch({
                type: 'rules/weeklyRuleChanges',
                payload: {
                    id,
                    weightPercentage,
                    ruleType,
                },
                onSuccess: () => {
                    this.getTeacherConstraintsList();
                },
            });
        }
    };

    //删除规则
    deleteContent = (id) => {
        let self = this;
        Modal.confirm({
            title: '您确定要删除该规则吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                self.confirmDelete(id);
            },
        });
    };

    //确认删除
    confirmDelete = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/ruleToDelete',
            payload: {
                id: id,
            },
            onSuccess: () => {
                this.getTeacherConstraintsList();
                this.getAddRulesAndRuleCount();
            },
        });
    };

    //编辑规则
    editContent = (id) => {
        const { dispatch } = this.props;
        this.setState({
            editStatus: true,
        });
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id,
            },
        }).then(() => {
            const {
                editRuleInformation: { acRuleFilterParamInputModelList, weightPercentage },
                activeKey,
            } = this.props;
            let {
                teacherTimeRuleType,
                teacherTimeTeacherIdList,
                teacherTimeRuleDefault,
                dayMax,
                dayContinuousMax,
            } = acRuleFilterParamInputModelList[0];
            this.setState({
                teacherIdList: teacherTimeTeacherIdList,
                count: activeKey == 6 ? dayMax : dayContinuousMax,
                weightPercentage,
            });
            this.necessary?.setState({
                value: teacherTimeTeacherIdList ? teacherTimeTeacherIdList : [],
                userIds: teacherTimeTeacherIdList ? teacherTimeTeacherIdList : [],
            });
        });
    };

    setStateFn = (type, value) => {
        this.setState({
            [type]: value,
        });
    };

    renderWeightPercentageHtml = () => {
        const {
            dataSource: { id, ruleType },
            showConditionList,
            currentClickRuleId,
        } = this.props;
        const { editStatus, showWeightPercentageList } = this.state;
        let weightPercentage = editStatus
            ? this.state.weightPercentage
            : this.props.dataSource.weightPercentage;
        return (
            <div className={styles.weightPercentage}>
                {weightPercentage == '100' && (
                    <span
                        className={styles.commonButton + ' ' + styles.necessaryBtn}
                        onClick={this.changeShowWeightPercentageList}
                    >
                        {trans('global.Must Satisfy', '必须满足')}
                    </span>
                )}
                {weightPercentage == '95' && (
                    <span
                        className={styles.commonButton + ' ' + styles.unNecessaryBtn}
                        onClick={this.changeShowWeightPercentageList}
                    >
                        {trans('global.Try to Satisfy', '尽量满足')}
                    </span>
                )}
                {showWeightPercentageList && showConditionList && currentClickRuleId === id && (
                    <div className={styles.weightPercentageList}>
                        <span
                            className={styles.commonButton + ' ' + styles.necessaryBtn}
                            onClick={this.changeWeightPercentage.bind(this, '100', id, ruleType)}
                        >
                            {trans('global.Must Satisfy', '必须满足')}
                        </span>
                        <span
                            className={styles.commonButton + ' ' + styles.unNecessaryBtn}
                            onClick={this.changeWeightPercentage.bind(this, '95', id, ruleType)}
                        >
                            {trans('global.Try to Satisfy', '尽量满足')}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    saveRules = async () => {
        const { dispatch, dataSource, activeKey, currentVersion, createOrEdit, ifDefaultSetting } =
            this.props;
        const { count, weightPercentage } = this.state;
        if (!count) {
            message.warning('所选节次不能为空');
            return;
        }
        let teacherTimeTeacherIdList = this.necessary?.state.userIds;
        let dispatchType = !dataSource.id ? 'rules/newRuleManagement' : 'rules/weeklyRuleChanges';
        await dispatch({
            type: 'rules/setTeacherConstraintsLoading',
            payload: true,
        });
        await dispatch({
            type: dispatchType,
            payload: {
                acRuleFilterParamInputModelList: [
                    {
                        teacherTimeRuleType: activeKey == 6 ? 1 : 2,
                        teacherTimeTeacherIdList,
                        teacherTimeRuleDefault: Boolean(ifDefaultSetting),
                        [activeKey == 6 ? 'dayMax' : 'dayContinuousMax']: count,
                    },
                ],
                baseRuleId: 11,
                title: this.getTitle(teacherTimeTeacherIdList, count),
                versionId: currentVersion,
                weightPercentage,
                id: dataSource.id,
            },
        }).then(() => {
            this.getTeacherConstraintsList();
            this.getAddRulesAndRuleCount();
        });
        await dispatch({
            type: 'rules/setTeacherConstraintsLoading',
            payload: false,
        });
        this.cancelSave();
    };

    cancelSave = () => {
        const { changeAddRulesStatus, ifDefaultSetting, dataSource } = this.props;
        typeof changeAddRulesStatus === 'function' && changeAddRulesStatus(false);
        this.setStateFn('editStatus', false);
        if (ifDefaultSetting) {
            const { dataSource, changeDefaultClickStatus } = this.props;
            typeof changeDefaultClickStatus === 'function' &&
                changeDefaultClickStatus(isEmpty(dataSource));
        }
    };

    getTitle = (teacherTimeTeacherIdList, count) => {
        const { fetchTeacherAndOrg, ifDefaultSetting, activeKey } = this.props;
        if (ifDefaultSetting) {
            if (activeKey == 6) {
                return `默认每天最多上${count}节课`;
            } else {
                return `默认每天最多连续上${count}节课`;
            }
        } else {
            if (teacherTimeTeacherIdList) {
                let teacherNameList = [];
                fetchTeacherAndOrg.forEach((teacherItem) => {
                    if (!teacherItem.orgFlag && teacherTimeTeacherIdList.includes(teacherItem.id)) {
                        teacherNameList.push(teacherItem.name);
                    }
                });
                return `${teacherNameList.join('、')} ${count} 节`;
            }
        }
    };

    changeShowWeightPercentageList = (e) => {
        const {
            changeCondition,
            dataSource: { id },
        } = this.props;
        e.nativeEvent.stopImmediatePropagation();
        typeof changeCondition === 'function' && changeCondition(true, id);
        this.setStateFn('showWeightPercentageList', true);
    };

    render() {
        const {
            dataSource,
            createOrigin,
            fetchTeacherAndOrg,
            ifDefaultSetting,
            activeKey,
            showConditionList,
        } = this.props;
        const { editStatus, count, teacherIdList } = this.state;
        return (
            <div className={styles.teacherConstraintsRuleItemWrapper}>
                {editStatus ? (
                    <Fragment>
                        {!ifDefaultSetting && (
                            <SelectTeacherAndOrg
                                placeholder="搜索或选择人员"
                                treeData={fetchTeacherAndOrg}
                                onRef={(ref) => {
                                    this.necessary = ref;
                                }}
                                userIds={teacherIdList}
                                selectType="1"
                            />
                        )}

                        <div className={styles.teacherConstraintsRuleItem}>
                            <div className={styles.leftPart}>
                                <span>{activeKey == 6 ? '每天最多' : '每天最多连上'}</span>
                                <InputNumber
                                    value={count}
                                    min={1}
                                    onChange={(value) => this.setStateFn('count', value)}
                                />
                                <span>节</span>
                            </div>
                            <div className={styles.middlePart}>
                                {this.renderWeightPercentageHtml()}
                            </div>
                            <div className={styles.rightPart}>
                                <span className={styles.saveBtn} onClick={this.saveRules}>
                                    保存
                                </span>
                                <span className={styles.cancel} onClick={this.cancelSave}>
                                    取消
                                </span>
                            </div>
                        </div>
                    </Fragment>
                ) : (
                    <div className={styles.teacherConstraintsRuleItem}>
                        <div className={styles.leftPart}>
                            <Switch
                                size="small"
                                checked={dataSource.status === 1}
                                onChange={this.switchButtonOpen.bind(this, dataSource)}
                            />
                            <span className={styles.title}>
                                <Tooltip
                                    title={dataSource.title}
                                    placement="bottomLeft"
                                    overlayStyle={{ whiteSpace: 'pre-wrap' }}
                                >
                                    <span> {dataSource.title}</span>
                                </Tooltip>
                            </span>
                        </div>
                        <div className={styles.rightPart}>
                            <span className={styles.btnList}>
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
                            </span>
                            {this.renderWeightPercentageHtml()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
