import React, { PureComponent } from 'react';
import { Button, Table, Icon, Row, Col, Select, Modal, message, Popconfirm } from 'antd';
// import "../../../index.css";
import styles from './index.less';
import { connect } from 'dva';
import { openScroll, stopScroll } from '../../../../../../utils/utils';
import { isEmpty } from 'lodash';

const Option = Select.Option;

@connect((state) => ({
    tableList: state.teacher.tableList,
    ruleList: state.teacher.ruleList,
    editMsg: state.teacher.editMsg,
    pointDelMsg: state.teacher.pointDelMsg,
    roleTagInfo: state.teacher.roleTagInfo,
    listGradeGroup: state.teacher.listGradeGroup,
}))
class ConfigPoint extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableList: [],
            isEdit: false,
            permissionName: '',
            permissionId: [],
            editPermission: [],
            ruleList: [],
            paramList: [],
            permissionIdSigure: null,
            show: false,
            visiblePoint: false,
            roleId: null,
            showClose: true,
            noData: false,
            firstValue: null,
            secondValue: null,
            ruleAndParameterModels: [],
        };
    }

    componentDidMount() {
        const { dispatch, roleTagInfo, permissionObj } = this.props;
        dispatch({
            type: 'teacher/listGradeGroup',
            payload: {},
        });
        if (!isEmpty(permissionObj) && !isEmpty(permissionObj.ruleAndParameterModels)) {
            this.setState({
                ruleAndParameterModels: permissionObj.ruleAndParameterModels,
            });
        }
        this.setState({
            roleId: roleTagInfo.tag,
        });
        this.handleSelectRule();
    }

    // 数据权限规则一级范围focus事件请求
    handleSelectRule = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/selectRuleByPermissionId',
            payload: {
                permissionId: this.state.permissionIdSigure,
            },
        }).then(() => {
            const { ruleList } = this.props;
            if (ruleList) {
                this.setState({
                    ruleOptionList: ruleList,
                    noData: false,
                });
            } else {
                this.setState({
                    noData: true,
                });
            }
        });
    };

    // 数据权限一级select框的change事件
    handleDataChange = (index, value) => {
        const { ruleOptionList } = this.state;
        let tempObj = JSON.parse(JSON.stringify(this.state.ruleAndParameterModels));
        let ruleVal = JSON.parse(value);
        let ruleObj = {};
        !isEmpty(ruleOptionList) &&
            ruleOptionList.map((item) => {
                if (item.id == ruleVal.id) {
                    return (ruleObj = item);
                }
            });
        let a;
        for (let i = 0; i < tempObj.length; i++) {
            if (ruleVal.id === tempObj[i].id && index !== i) {
                a = 1;
                message.info('选择规则重复');
                break;
            }
        }
        //存一级
        let saveChild = { ...tempObj[index] };
        saveChild.id = a ? '' : ruleVal.id;
        saveChild.param = '';
        saveChild.paramType = a
            ? ''
            : ruleObj.ruleCode == 'class:student' || ruleObj.ruleCode == 'grade:student'
            ? ruleVal.type
            : '';
        saveChild.ruleName = a ? '' : ruleVal.ruleName;
        tempObj[index] = saveChild;
        this.setState({
            ruleAndParameterModels: [...tempObj],
            firstValue: value,
        });
    };

    // 存二级select数据
    handleDataChangeParam = (index, value) => {
        let tempObj = JSON.parse(JSON.stringify(this.state.ruleAndParameterModels));
        //存一级
        let saveChild = tempObj[index];
        saveChild.param = value.toString();
        this.setState({
            ruleAndParameterModels: [...tempObj],
            secondValue: value,
        });
    };

    // 完成
    handleComplate = () => {
        if (!this.state.firstValue && !this.state.secondValue) {
            this.props.visible(true);
        } else {
            const { dispatch, permissionObj } = this.props,
                { ruleAndParameterModels } = this.state,
                len = ruleAndParameterModels.length,
                arr = [];
            console.log(ruleAndParameterModels, 'ruleAndParameterModels');
            for (let i = 0; i < len; i++) {
                arr.push({
                    permissionId: permissionObj?.permissionId,
                    permissionPackageId: permissionObj?.packageId,
                    ruleId: ruleAndParameterModels[i].id,
                    param: ruleAndParameterModels[i].param,
                });
            }
            dispatch({
                type: 'teacher/updatePermissionPackageRuleRelation',
                payload: arr,
            }).then(() => {
                const { editMsg } = this.props;
                if (editMsg && editMsg.status) {
                    this.props.visible(editMsg.status);
                }
            });
        }
    };

    //添加select框
    handleAdd = () => {
        let ruleAndParameterModels = [...this.state.ruleAndParameterModels];
        ruleAndParameterModels.push({});
        this.setState({
            ruleAndParameterModels,
        });
    };

    dealWithParamStr = (str) => {
        let newStr = str ? str.split(',') : undefined;
        return newStr;
    };

    // 权限点规则删除
    handlePointDelete = (ruleId) => {
        const { dispatch, permissionObj } = this.props;
        const payloadArr = [];
        payloadArr.push({
            permissionId: permissionObj?.permissionId,
            permissionPackageId: permissionObj?.packageId,
            ruleId,
        });
        dispatch({
            type: 'teacher/deletePermissionPackageRuleRelation',
            payload: payloadArr,
        }).then(() => {
            const { pointDelMsg } = this.props;
            const { ruleAndParameterModels } = this.state;
            if (pointDelMsg.status) {
                const a = ruleAndParameterModels.filter((ele) => {
                    return ele.id !== ruleId;
                });
                this.setState({
                    ruleAndParameterModels: a,
                });
            }
        });
    };

    render() {
        const { ruleOptionList, ruleAndParameterModels } = this.state;
        const { listGradeGroup } = this.props;

        return (
            <div className={styles.editModal}>
                {
                    <div className={styles.con}>
                        <p style={{ fontSize: '16px', textAlign: 'left' }}>
                            将该数据权限点的权限范围设置为：
                        </p>
                        {ruleAndParameterModels.map((item, index) => {
                            return (
                                <Row key={item.id + '' + Math.random()}>
                                    <Col span={20} style={{ marginBottom: '5px' }}>
                                        <Select
                                            style={{ width: '40%', marginRight: '1%' }}
                                            defaultValue={item.ruleName}
                                            onChange={this.handleDataChange.bind(this, index)}
                                            placeholder="选择规则"
                                        >
                                            {ruleOptionList && ruleOptionList.length > 0 ? (
                                                ruleOptionList &&
                                                ruleOptionList.map((innerItem, innerIndex) => {
                                                    return (
                                                        <Option
                                                            key={JSON.stringify({
                                                                id: innerItem.id,
                                                                type: innerItem.paramType,
                                                                ruleName: innerItem.ruleName,
                                                            })}
                                                        >
                                                            {innerItem.ruleName}
                                                        </Option>
                                                    );
                                                })
                                            ) : (
                                                <Option disabled value={null}>
                                                    当前权限无规则
                                                </Option>
                                            )}
                                        </Select>
                                        {
                                            //如果一级菜单有 paramType ，那么就有二级菜单
                                            item.paramType ? (
                                                <Select
                                                    style={{ width: '58%' }}
                                                    mode="multiple"
                                                    onChange={this.handleDataChangeParam.bind(
                                                        this,
                                                        index
                                                    )}
                                                    showArrow
                                                    value={this.dealWithParamStr(item.param)}
                                                    placeholder="选择范围"
                                                >
                                                    {listGradeGroup[
                                                        item.ruleCode == 'grade:student'
                                                            ? 'gradeModels'
                                                            : 'groupModels'
                                                    ] &&
                                                        listGradeGroup[
                                                            item.ruleCode == 'grade:student'
                                                                ? 'gradeModels'
                                                                : 'groupModels'
                                                        ].map((rangeItem, rangeIndex) => {
                                                            return (
                                                                <Option key={rangeItem.id}>
                                                                    {rangeItem.name}
                                                                </Option>
                                                            );
                                                        })}
                                                </Select>
                                            ) : null
                                        }
                                    </Col>
                                    <Col span={1} style={{ marginTop: '10px' }}>
                                        {index === 0 ? (
                                            <span onClick={this.handleAdd.bind(this)}>
                                                <Icon
                                                    type="plus-circle"
                                                    style={{ color: '#507AFB' }}
                                                />
                                            </span>
                                        ) : (
                                            <span>
                                                <Popconfirm
                                                    placement="topRight"
                                                    title={'确定删除该条权限规则吗？'}
                                                    onConfirm={this.handlePointDelete.bind(
                                                        this,
                                                        item.id
                                                    )}
                                                    okText="确定"
                                                    cancelText="取消"
                                                >
                                                    <Icon
                                                        type="delete"
                                                        style={{
                                                            color: '#507AFB',
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                </Popconfirm>
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                            );
                        })}

                        {isEmpty(ruleAndParameterModels) && (
                            <span onClick={this.handleAdd.bind(this)}>
                                <Icon type="plus-circle" style={{ color: '#507AFB' }} />
                            </span>
                        )}

                        <div className={styles.btnBox}>
                            <Button
                                type="primary"
                                onClick={this.handleComplate}
                                className={styles.btnTwo}
                            >
                                完成
                            </Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default connect()(ConfigPoint);
