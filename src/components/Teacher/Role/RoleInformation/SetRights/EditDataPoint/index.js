import React, { PureComponent } from 'react';
import { Button, Form, Icon, Row, Col, Select, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { isEmpty, unionBy } from 'lodash';

const Option = Select.Option;

@connect((state) => ({
    tableList: state.teacher.tableList,
    ruleList: state.teacher.ruleList,
    rangeList: state.teacher.rangeList,
    editMsg: state.teacher.editMsg,
    pointDelMsg: state.teacher.pointDelMsg,
    roleTagInfo: state.teacher.roleTagInfo,
    listGradeGroup: state.teacher.listGradeGroup,
    rolePermissionobj: state.global.rolePermissionobj,
}))
@Form.create()
class EditDataPoint extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pointDetailMsg: [],
            tableList: [],
            ruleOptionList: null,
            rangeList: {},
            showParam: true,
            roleId: null,
            firstValue: null,
            secondValue: null,
            permissionObjList: [],
        };
    }

    componentDidMount() {
        this.handleSelectRule();
        const { dispatch, roleTagInfo, permissionObjList } = this.props;
        dispatch({
            type: 'teacher/listGradeGroup',
            payload: {},
        });
        this.setState({
            roleId: roleTagInfo.tag,
            permissionObjList,
        });
    }

    // 数据权限规则一级范围focus事件请求
    handleSelectRule = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/selectRuleByPermissionId',
            payload: {
                permissionId: null,
            },
        }).then(() => {
            console.log(this.props.ruleList, 'kks');
            this.setState({
                ruleOptionList: this.props.ruleList,
            });
        });
    };

    // 数据权限一级select框的change事件
    handleDataChange = (index, innerIndex, value) => {
        const { ruleOptionList } = this.state;
        console.log(ruleOptionList, 'ruleOptionList')
        const { permissionObjList } = this.state;
        //存一级
        let a,
            selectList = permissionObjList[index].ruleAndParameterModels,
            len = selectList.length,
            saveChild,
            relValue = JSON.parse(value);
        console.log('relValue: ', relValue);
        let ruleObj = {};
        !isEmpty(ruleOptionList) &&
            ruleOptionList.map((item) => {
                if (item.id == relValue.id) {
                    return (ruleObj = item);
                }
            });
        console.log(ruleObj, 'ruleObj');
        for (let i = 0; i < len; i++) {
            if (selectList[i].id == relValue.id && innerIndex !== i) {
                a = 1;
                message.info('选择规则重复');
                break;
            }
        }
        saveChild = permissionObjList[index].ruleAndParameterModels[innerIndex];
        saveChild.param = '';
        saveChild.id = a ? '' : relValue.id;
        saveChild.paramType = a
            ? ''
            : ruleObj.ruleCode == 'class:student' || ruleObj.ruleCode == 'grade:student'
            ? relValue.paramType
            : '';
        saveChild.ruleName = a ? '' : relValue.ruleName;

        this.setState({
            permissionObjList: [...permissionObjList],
            firstValue: value,
        });
    };

    // 数据权限规则二级范围select事件
    handleDataSelect = (e) => {
        const { dispatch } = this.props;
        if (JSON.parse(e).paramType) {
            dispatch({
                type: 'teacher/getClassOrGradeByParamType',
                payload: {
                    paramType: JSON.parse(e).paramType,
                },
            }).then(() => {
                const { rangeList } = this.props;
                this.setState({
                    rangeList,
                });
            });
        }
    };

    // 数据权限二级select框的change事件
    handleSecondDataChange = (index, innerIndex, value) => {
        const { permissionObjList } = this.state;
        let saveChild = permissionObjList[index].ruleAndParameterModels[innerIndex];
        saveChild.param = value.toString();

        this.setState({
            permissionObjList: [...permissionObjList],
            secondValue: value,
        });
    };

    handleAdd = (index) => {
        let tempObjList = JSON.parse(JSON.stringify(this.state.permissionObjList));
        console.log('tempObjList: ', tempObjList);
        console.log(tempObjList, tempObjList[0], 'lll');
        isEmpty(tempObjList[0]) ? (tempObjList = [{ ruleAndParameterModels: [{}] }]) : 
        tempObjList[0].ruleAndParameterModels.push({});
        // tempObjList[0].ruleAndParameterModels = [{}] :
        // tempObjList[0].ruleAndParameterModels.push({});
        this.setState({
            permissionObjList: [...tempObjList],
        });
    };

    handleComplate = () => {
        const {
            dispatch,
            rolePermissionobj: { appPermissionList },
        } = this.props;
        let tempObjList = JSON.parse(JSON.stringify(this.state.permissionObjList));
        // let len = tempObjList.length;//原逻辑
        let tempLen = tempObjList.length;
        let len = tempObjList[0].ruleAndParameterModels.length;

        let tempPackageId = '';
        !isEmpty(appPermissionList)
            ? appPermissionList.map((item) => {
                  !isEmpty(item.permissionDetailModels) &&
                      item.permissionDetailModels.map((el) => {
                          if (el.packageId) {
                              return (tempPackageId = el.packageId);
                          }
                      });
              })
            : null;

        let arr = [];

        for (let j = 0; j < tempLen; j++) {
            for (let i = 0; i < len; i++) {
                let tempId = '';
                if (tempObjList[j]?.permissionId) {
                    tempId = tempObjList[j]?.permissionId;
                }
                arr.push({
                    permissionId: tempId ? tempId : tempPackageId ? tempPackageId : '',
                    permissionPackageId: tempObjList[j]?.packageId,
                    ruleId: tempObjList[0].ruleAndParameterModels[i].id,
                    param: tempObjList[0].ruleAndParameterModels[i].param,
                });
            }
        }

        arr = unionBy(arr, 'permissionId');

        // for (let i = 0; i < len; i++) {
        //     permissionIds.push(tempObjList[i].permissionId);
        //     if (i === 0) {
        //         let childLen = tempObjList[i].ruleAndParameterModels.length;
        //         for (let j = 0; j < childLen; j++) {
        //             if (tempObjList[i].ruleAndParameterModels[j].id) {
        //                 ruleIdAndRange.push({
        //                     ruleId: tempObjList[i].ruleAndParameterModels[j].id, // 规则
        //                     param: tempObjList[i].ruleAndParameterModels[j].param
        //                         ? tempObjList[i].ruleAndParameterModels[j].param
        //                         : null,
        //                 });
        //             }
        //         }
        //     }
        // }
        dispatch({
            // type: 'teacher/updatePermissionPackageRuleRelationNew',
            type: 'teacher/updatePermissionPackageRuleRelation',
            // payload: {
            // permissionPackageId: tempObjList[0].packageId,
            // permissionIds: permissionIds,
            // ruleIdAndRange: ruleIdAndRange,
            // },
            payload: arr,
        }).then(() => {
            const { editMsg } = this.props;
            if (editMsg && editMsg.status) {
                this.props.visible(editMsg.status);
            }
        });
    };
    dealWithParamStr = (str) => {
        let newStr = str ? str.split(',') : undefined;
        return newStr;
    };

    handleDelete = (permissionId, packageId, ruleId) => {
        const { dispatch } = this.props;
        const payloadArr = [];
        payloadArr.push({
            permissionId: permissionId,
            permissionPackageId: packageId,
            ruleId,
        });
        dispatch({
            type: 'teacher/deletePermissionPackageRuleRelation',
            payload: payloadArr,
        }).then(() => {
            const { pointDelMsg } = this.props;
            const { permissionObjList } = this.state;
            if (pointDelMsg.status) {
                const a = permissionObjList[0].ruleAndParameterModels.filter((ele) => {
                    return ele.id !== ruleId;
                });
                permissionObjList[0].ruleAndParameterModels = a;
                this.setState({
                    permissionObjList: [...permissionObjList],
                });
            }
        });
    };
    onCancel = () => {
        this.props.onCancel();
    };
    render() {
        const { ruleOptionList, rangeList, permissionObjList } = this.state;
        const { listGradeGroup } = this.props;
        console.log('permissionObjList: ', permissionObjList);
        return (
            <div className={styles.editModal}>
                <p style={{ fontSize: '16px', textAlign: 'left' }}>
                    将{permissionObjList && permissionObjList.length}个数据权限点的权限范围设置为:{' '}
                </p>
                <div className={styles.tableScroll}>
                    {permissionObjList &&
                    permissionObjList.length > 0 &&
                    !isEmpty(permissionObjList[0].ruleAndParameterModels) ? (
                        permissionObjList.map((item, index) => {
                            if (index === 0) {
                                return (
                                    permissionObjList[index].ruleAndParameterModels &&
                                    permissionObjList[index].ruleAndParameterModels.map(
                                        (innerItem, innerIndex) => {
                                            return (
                                                <Row
                                                    key={
                                                        item.permissionId +
                                                        '' +
                                                        (innerItem.id || Math.random())
                                                    }
                                                    style={{ marginBottom: '10px' }}
                                                >
                                                    <Col span={23}>
                                                        <Select
                                                            style={{
                                                                width: '40%',
                                                                marginRight: '1%',
                                                            }}
                                                            defaultValue={innerItem.ruleName}
                                                            onSelect={this.handleDataSelect.bind(
                                                                this
                                                            )}
                                                            onChange={this.handleDataChange.bind(
                                                                this,
                                                                index,
                                                                innerIndex
                                                            )}
                                                            placeholder={
                                                                !item.haveRules
                                                                    ? '当前权限无规则'
                                                                    : '选择规则'
                                                            }
                                                        >
                                                            {ruleOptionList &&
                                                                ruleOptionList.map((d) => {
                                                                    return (
                                                                        <Option
                                                                            key={JSON.stringify({
                                                                                id: d.id,
                                                                                paramType:
                                                                                    d.paramType,
                                                                                ruleName:
                                                                                    d.ruleName,
                                                                            })}
                                                                        >
                                                                            {d.ruleName}
                                                                        </Option>
                                                                    );
                                                                })}
                                                        </Select>

                                                        {innerItem.paramType ? (
                                                            <Select
                                                                style={{ width: '58%' }}
                                                                mode="multiple"
                                                                onChange={this.handleSecondDataChange.bind(
                                                                    this,
                                                                    index,
                                                                    innerIndex
                                                                )}
                                                                value={this.dealWithParamStr(
                                                                    innerItem.param
                                                                )}
                                                                showArrow
                                                                optionFilterProp="children"
                                                                placeholder="选择范围"
                                                            >
                                                                {listGradeGroup[
                                                                    item.ruleCode == 'grade:student'
                                                                        ? 'gradeModels'
                                                                        : 'groupModels'
                                                                ] &&
                                                                    listGradeGroup[
                                                                        item.ruleCode ==
                                                                        'grade:student'
                                                                            ? 'gradeModels'
                                                                            : 'groupModels'
                                                                    ].map(
                                                                        (rangeItem, rangeIndex) => {
                                                                            return (
                                                                                <Option
                                                                                    key={
                                                                                        rangeItem.id
                                                                                    }
                                                                                >
                                                                                    {rangeItem.name}
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        ) : null}
                                                    </Col>
                                                    <Col span={1} style={{ paddingTop: '10px' }}>
                                                        {innerIndex === 0 ? (
                                                            <span
                                                                onClick={this.handleAdd.bind(this)}
                                                            >
                                                                <Icon
                                                                    type="plus-circle"
                                                                    style={{ color: '#507AFB' }}
                                                                />
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <Popconfirm
                                                                    placement="topRight"
                                                                    title={
                                                                        '确定删除该条权限规则吗？'
                                                                    }
                                                                    onConfirm={this.handleDelete.bind(
                                                                        this,
                                                                        item.permissionId,
                                                                        item.packageId,
                                                                        innerItem.id
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
                                        }
                                    )
                                );
                            }
                        })
                    ) : (
                        <span onClick={this.handleAdd.bind(this)}>
                            <Icon type="plus-circle" style={{ color: '#507AFB' }} />
                        </span>
                    )}
                </div>
                <div className={styles.btnBox}>
                    <Button type="default" onClick={this.onCancel} className={styles.btnOne}>
                        取消
                    </Button>
                    <Button type="primary" onClick={this.handleComplate} className={styles.btnTwo}>
                        完成
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect()(EditDataPoint);
