//学生组织--设置组织角色弹窗
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Select, Button, Icon, TreeSelect, message } from 'antd';
import icon from '../../../../icon.less';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;
const { confirm } = Modal;

let ids = 1;

@Form.create()
@connect((state) => ({
    orgCompletePath: state.teacher.orgCompletePath, //完整路径
    configureRoleList: state.teacher.configureRoleList, //所有配置角色的职位
    setOrgRoleStudentList: state.student.setOrgRoleStudentList, //学生列表
    addTeacherList: state.teacher.addTeacherList, //员工列表
}))
export default class StudentSetOrgRole extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cardList: [{ order: 0, status: false }], //卡片下标
            personsList: [], //选择学生
            saveRoleType: {}, //保存设置角色的类型
            canClick: true, //是否可以点击
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.setOrgRoleVisible != this.props.setOrgRoleVisible) {
            if (nextProps.setOrgRoleVisible) {
                this.getStudentList();
                this.getStaffList();
                this.getPathByTreeId(nextProps.treeId);
                this.getConfigureRoleList(nextProps.treeId, () => {
                    if (nextProps.orgInfo && nextProps.orgInfo.orgRoleList) {
                        this.setState(
                            {
                                cardList: this.formatOrgRoleList(nextProps.orgInfo.orgRoleList),
                                saveRoleType: this.formatRoleType(nextProps.orgInfo.orgRoleList),
                            },
                            () => {
                                //已有组织角色列表的长度
                                let orgRoleListLen = this.formatOrgRoleList(
                                    nextProps.orgInfo.orgRoleList
                                ).length;
                                ids = orgRoleListLen == 0 ? 1 : orgRoleListLen;
                            }
                        );
                    }
                });
            }
        }
    }

    //格式化已有的角色列表
    formatOrgRoleList = (list) => {
        if (!list || list.length == 0) return [{ order: 0, status: true }];
        let listIndexArr = [];
        list.map((item, index) => {
            let obj = { order: index, status: false };
            listIndexArr.push(obj);
        });
        return listIndexArr;
    };

    //格式化已有的角色类型
    formatRoleType = (list) => {
        const { configureRoleList } = this.props;
        if (!list || list.length == 0) return {};
        let obj = {};
        list.map((item, index) => {
            configureRoleList &&
                configureRoleList.length > 0 &&
                configureRoleList.map((list) => {
                    if (item.code == list.code) {
                        obj[index] = list.type;
                    }
                });
        });
        return obj;
    };

    //根据树节点id获取路径
    getPathByTreeId(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getPathByTreeId',
            payload: {
                nodeId: id,
            },
        });
    }

    handleCancel = () => {
        const { hideModal, form, fetchTreeNodeDetail } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'setOrgRole');
        typeof fetchTreeNodeDetail == 'function' && fetchTreeNodeDetail.call(this);
        form.resetFields();
        this.setState({
            cardList: [{ order: 0, status: false }],
            saveRoleType: {},
        });
    };

    //校验列表中是否有未填项
    validateValues = () => {
        let canAdd = false;
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                canAdd = true;
            }
        });
        return canAdd;
    };

    //校验是否有卡片正在操作
    haveOperating = (type, item) => {
        let canAdd = true;
        let cardList = JSON.parse(JSON.stringify(this.state.cardList));
        for (let i = 0; i < cardList.length; i++) {
            if (type == 'add') {
                if (cardList[i] && cardList[i]['status'] == true) {
                    canAdd = false;
                    break;
                }
            } else if (type == 'edit') {
                if (cardList[i] && cardList[i]['status'] == true && cardList[i]['order'] != item) {
                    canAdd = false;
                    break;
                }
            }
        }
        return canAdd;
    };

    //新增卡片
    addFormCard = () => {
        if (!this.haveOperating('add')) {
            message.info(trans('student.notSetNewRole', '您还有卡片未保存，不可再设置新的角色哦~'));
            return false;
        }
        // if(!this.validateValues()) {
        //     message.info("您有其他的角色卡片未操作完成哦~ 请先完善卡片");
        //     return false;
        // }
        let cardList = JSON.parse(JSON.stringify(this.state.cardList));
        cardList.push({ order: ids++, status: true });
        this.setState(
            {
                cardList: cardList,
            },
            () => {
                let orgCard = document.querySelectorAll('.orgCard');
                let index = this.state.cardList.length > 1 ? this.state.cardList.length - 1 : 0;
                orgCard[index] && orgCard[index].scrollIntoView();
            }
        );
    };

    //删除的二次确认
    confirmDelete(index) {
        // if(!this.haveOperating("add")) {
        //     message.info("您还有卡片未保存，暂时不可删除角色哦~");
        //     return false;
        // }
        let self = this;
        confirm({
            title: trans('student.isRemoveRole', '是否确认移除该组织角色？'),
            onOk() {
                self.deleteFormCard(index);
            },
            onCancel() {},
        });
    }

    //查找数组对象的下标
    findIndex = (arr, value) => {
        let index = arr.findIndex((item) => {
            return item.order == value;
        });
        return index;
    };

    //删除卡片
    deleteFormCard(index) {
        const { dispatch, treeId, form } = this.props;
        form.validateFields((err, values) => {
            if (!values[`orgRole${index}`]) {
                //配置角色参数为空，前端手动删除
                let cardList = JSON.parse(JSON.stringify(this.state.cardList));
                cardList.map((item) => {
                    if (item.order == index) {
                        cardList.splice(this.findIndex(cardList, item.order), 1);
                    }
                });
                this.setState({
                    cardList: cardList,
                });
                // if(cardList.indexOf(index) != -1) {
                //     cardList.splice(cardList.indexOf(index), 1);
                //     this.setState({
                //         cardList: cardList
                //     })
                // }
                return false;
            }
            dispatch({
                type: 'teacher/deleteOrgNodeRole',
                payload: {
                    nodeId: treeId,
                    roleCode: values[`orgRole${index}`],
                    type: 2,
                },
                onSuccess: () => {
                    form.resetFields();
                    //保存成功，调用已有角色列表
                    this.getHaveRoles();
                },
            });
        });
    }

    //在一个角色中新增删除学生
    addDeletePerson(index) {
        const { form, dispatch, treeId } = this.props;
        if (!this.state.canClick) {
            message.info(trans('student.noSaveAgain', '不要重复保存哦~'));
            return false;
        }
        this.setState({
            canClick: false,
        });
        form.validateFields((err, values) => {
            if (
                !values[`orgRole${index}`] ||
                !values[`orgRoleName${index}`] ||
                values[`orgRoleName${index}`].length == 0
            ) {
                message.info(trans('student.saveBeforeComplete', '请完善卡片再保存哦~'));
                return false;
            }
            let payloadObj = {
                nodeId: treeId,
                roleCode: values[`orgRole${index}`],
                userIdList: values[`orgRoleName${index}`],
            };
            dispatch({
                type: 'teacher/setOrgRole',
                payload: payloadObj,
                onSuccess: () => {
                    let self = this;
                    setTimeout(function () {
                        form.resetFields();
                        self.handleCancel();
                    }, 200);
                },
            }).then(() => {
                this.setState({
                    canClick: true,
                });
            });
        });
    }

    //获取已有角色
    getHaveRoles() {
        const { fetchTreeNodeDetail } = this.props;
        typeof fetchTreeNodeDetail == 'function' &&
            fetchTreeNodeDetail.call(this).then(() => {
                const { orgInfo } = this.props;
                if (orgInfo && orgInfo.orgRoleList) {
                    this.setState(
                        {
                            cardList: this.formatOrgRoleList(orgInfo.orgRoleList),
                            saveRoleType: this.formatRoleType(orgInfo.orgRoleList),
                        },
                        () => {
                            //已有组织角色列表的长度
                            let orgRoleListLen = this.formatOrgRoleList(orgInfo.orgRoleList).length;
                            ids = orgRoleListLen == 0 ? 1 : orgRoleListLen;
                        }
                    );
                }
            });
    }

    //获取员工列表
    getStaffList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getAllTeacherList',
            payload: {
                type: 1, //1员工 2学生
            },
        });
    }

    //获取学生列表
    getStudentList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getSetOrgRoleStudent',
            payload: {
                status: 1, //1：在读，2：待入学 3：休学
            },
        });
    }

    //获取所有配置角色的职位
    getConfigureRoleList(id, callback) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getConfigureRole',
            payload: {
                nodeId: id,
            },
        }).then(() => {
            callback();
        });
    }

    //格式化学生列表
    formatStudentRoleList = (roleList) => {
        if (!roleList || roleList.length < 0) return [];
        let resultArr = [];
        roleList.map((item) => {
            let obj = {
                // title: `${item.name}-${item.ename}`,
                title:
                    item.ename && item.ename != item.name
                        ? `${item.name}-${item.ename}`
                        : `${item.name}`,
                key: item.userId,
                value: item.userId,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //格式化员工列表
    formatRoleList = (roleList) => {
        if (!roleList || roleList.length < 0) return [];
        let resultArr = [];
        roleList.map((item) => {
            let obj = {
                // title: `${item.name}-${item.ename}`,
                title:
                    item.ename && item.ename != item.name
                        ? `${item.name}-${item.ename}`
                        : `${item.name}`,
                key: item.id,
                value: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //获取已有角色列表的id
    formatUserListId = (arr) => {
        if (!arr || arr.length == 0) return [];
        let idArr = [];
        arr.map((item) => {
            idArr.push(item.id);
        });
        return idArr;
    };

    //判断是否可选
    judgeDisabled(code) {
        const { orgInfo } = this.props;
        let abled = false;
        orgInfo.orgRoleList &&
            orgInfo.orgRoleList.length > 0 &&
            orgInfo.orgRoleList.map((item) => {
                if (code == item.code) {
                    abled = true;
                }
            });
        return abled;
    }

    //选择人员
    selectMember(index, canEditCode, value) {
        //当前角色不可操作，并且有未保存的卡片， return
        if (canEditCode && !this.haveOperating('edit', index)) {
            message.info(
                trans('student.nonEffectiveSave', '您还有卡片未保存，此时设置的人员无效哦~')
            );
            return false;
        }
        let cardList = JSON.parse(JSON.stringify(this.state.cardList));
        for (let i = 0; i < cardList.length; i++) {
            if (cardList[i] && cardList[i]['order'] == index) {
                cardList[i]['status'] = true;
            } else {
                //debugger;
                cardList[i]['status'] = false;
            }
        }
        this.setState({
            cardList: cardList,
        });
    }

    render() {
        const {
            setOrgRoleVisible,
            form: { getFieldDecorator },
            setOrgRoleStudentList,
            addTeacherList,
            configureRoleList,
            orgCompletePath,
            orgInfo,
        } = this.props;
        const { cardList, saveRoleType } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const personProps = {
            placeholder: trans(
                'student.selectStudentRole',
                '请搜索或选择需要在组织下配置该角色的学生'
            ),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            className: styles.selectPersonStyle,
        };
        //已有的角色列表
        let orgInfoList = (orgInfo && orgInfo.orgRoleList) || [];
        return (
            <div>
                <Modal
                    visible={setOrgRoleVisible}
                    title={trans('student.setOrgRole', '设置组织角色')}
                    footer={null}
                    width="800px"
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    style={{ top: '10px' }}
                    className={styles.setOrgRoleStyle}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label={trans('student.orgCompletePath', '组织节点')}>
                            <span>{orgCompletePath}</span>
                        </Form.Item>
                        <div className={styles.orgCardList}>
                            {cardList &&
                                cardList.length > 0 &&
                                cardList.map((item, index) => {
                                    return (
                                        <div className="orgCard" key={index}>
                                            {item.status == true ? (
                                                <i
                                                    className={`${icon.iconfont}  ${styles.saveCard}`}
                                                    onClick={this.addDeletePerson.bind(
                                                        this,
                                                        item.order
                                                    )}
                                                >
                                                    &#xe9f5;
                                                </i>
                                            ) : (
                                                <i
                                                    className={`${icon.iconfont}  ${styles.saveCardDisabled}`}
                                                >
                                                    &#xe9f5;
                                                </i>
                                            )}
                                            <i
                                                className={`${icon.iconfont}  ${styles.deleteCard}`}
                                                onClick={this.confirmDelete.bind(this, item.order)}
                                            >
                                                &#xe739;
                                            </i>

                                            <Form.Item label={trans('student.setRole', '配置角色')}>
                                                {getFieldDecorator(`orgRole${item.order}`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: trans(
                                                                'student.selectOrgRole',
                                                                '请选择角色名称'
                                                            ),
                                                        },
                                                    ],
                                                    initialValue: orgInfoList[index]
                                                        ? orgInfoList[index].code
                                                        : undefined,
                                                })(
                                                    <Select
                                                        className={styles.selectOrgStyle}
                                                        placeholder={trans(
                                                            'student.selectOrgRole',
                                                            '请选择角色名称'
                                                        )}
                                                        disabled={
                                                            orgInfoList[index] &&
                                                            orgInfoList[index].code
                                                                ? true
                                                                : false
                                                        }
                                                        style={{ width: 250 }}
                                                    >
                                                        {configureRoleList &&
                                                            configureRoleList.length > 0 &&
                                                            configureRoleList.map((item) => {
                                                                return (
                                                                    <Option
                                                                        value={item.code}
                                                                        key={item.type}
                                                                        disabled={this.judgeDisabled(
                                                                            item.code
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <Form.Item
                                                label={trans('student.selectPerson', '选择人员')}
                                            >
                                                {getFieldDecorator(`orgRoleName${item.order}`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: trans(
                                                                'student.setRoleBySelect',
                                                                '请搜索选择需要在组织下配置该角色的人员'
                                                            ),
                                                        },
                                                    ],
                                                    initialValue: orgInfoList[index]
                                                        ? this.formatUserListId(
                                                              orgInfoList[index].userList
                                                          )
                                                        : [],
                                                })(
                                                    <TreeSelect
                                                        {...personProps}
                                                        className={styles.setOrgRoleSelectPerson}
                                                        treeData={
                                                            saveRoleType[index] == 2
                                                                ? this.formatStudentRoleList(
                                                                      setOrgRoleStudentList
                                                                  )
                                                                : this.formatRoleList(
                                                                      addTeacherList
                                                                  )
                                                        }
                                                        onChange={this.selectMember.bind(
                                                            this,
                                                            item.order,
                                                            orgInfoList[index] &&
                                                                orgInfoList[index].code
                                                        )}
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className={styles.addCardBtn}>
                            <span className={styles.setButtonStyle} onClick={this.addFormCard}>
                                <Icon type="plus" /> {trans('student.setNewRole', '设置新的角色')}
                            </span>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}
