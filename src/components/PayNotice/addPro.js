//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './addPro.less';
import { Select, TreeSelect, Input, Checkbox, Tree } from 'antd';
import { trans } from '../../utils/i18n';

const { Option } = Select;
const { TreeNode } = Tree;

export default class AddPro extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            indeterminate: true, // 全选显示状态
            checkAll: false, // 是否全选
            checkedList: [], // 选中的数据
            mainList: [], // 获取全部List
            chargeList: [], // 组件右侧项目显示的数据
            name: null, // 存储用户名，用来处理选中项样式
            keyValue: '',
        };
    }

    componentDidMount() {
        const { chargeList, actionCharge, searchChargeValue } = this.props;
        // 关闭组件再打开，若已存在勾选项，赋值给checkedList，回显
        if (actionCharge) {
            this.setState({
                checkedList: actionCharge,
            });
            this.selectAccount(chargeList, actionCharge); // 左侧用户项目选中
        }
        this.setState({
            keyValue: searchChargeValue,
        });
        this.getData(chargeList);
    }

    componentWillReceiveProps(nextProps) {
        const { chargeList } = this.state;
        this.setState(
            {
                checkedList: nextProps.actionCharge,
                chargeList: chargeList.length ? chargeList : nextProps.chargeList,
                // chargeList:nextProps.chargeList
            },
            () => {
                this.getData(nextProps.chargeList);
            }
        );
    }

    // 获取各个列表数据
    getData = (e) => {
        const { actionCharge } = this.props;
        if (actionCharge && actionCharge.length) {
            let len = actionCharge.length;
            let checkedLen = (e && e.length) || 0; // chargeList.length
            for (let i = 0; i < len; i++) {
                let item = JSON.parse(actionCharge[i]);
                // 组件关闭后重新打开，会重新渲染，此时需要将已选中的收费项目回显
                for (let j = 0; j < checkedLen; j++) {
                    // 将已选中的list与接口返回的list对比，若用户名相等，回显当前用户名下的收费项目
                    if (item.accountName == e[j].accountName) {
                        this.setState(
                            {
                                chargeList: e[j].payChargeItemMapperModelList,
                                mainList: e,
                            },
                            () => {
                                const list = this.getOptionList();
                                this.setState({
                                    checkAll: this.state.checkedList.length === list.length,
                                    indeterminate: false,
                                });
                            }
                        );
                        return;
                    }
                }
            }
        }
        this.setState({
            // chargeList: this.state.chargeList.length?this.state.chargeList:(e && e.length && e[0].payChargeItemMapperModelList), // 收费项目默认显示list第一条
            chargeList: e && e.length && e[0].payChargeItemMapperModelList, // 收费项目默认显示list第一条
            mainList: e,
        });
    };

    // 对收费项目数据处理，获取全部value
    getOptionList = () => {
        const { chargeList } = this.state;
        const optionList = [];
        chargeList &&
            chargeList.length &&
            chargeList.map((item, index) => {
                optionList.push(JSON.stringify(item));
            });
        return optionList;
    };

    // 全选的change事件
    onCheckAllChargeChange = (e) => {
        this.setState(
            {
                checkedList: e.target.checked ? this.getOptionList() : [],
                indeterminate: false,
                checkAll: e.target.checked,
            },
            () => {
                this.selectAccount(this.state.mainList, this.state.checkedList);
                // 全选后将选中项传入父组件
                this.props.getActionChargeList(this.state.checkedList);
            }
        );
    };

    // 选择树节点change事件
    changeItemList = (checkedList) => {
        const list = this.getOptionList();
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < list.length,
            checkAll: checkedList.length === list.length,
        });
        this.selectAccount(this.state.mainList, checkedList);
        // 将选中项传入父组件
        this.props.getActionChargeList(checkedList);
    };

    // 选择收费项目，左侧对应用户选中
    selectAccount = (mainList, checkedList) => {
        mainList.map((item, index) => {
            checkedList.map((e, i) => {
                e = JSON.parse(e);
                // 若用户名相等，为应选中的用户
                if (item.accountName == e.accountName) {
                    this.setState({
                        name: e.accountName,
                    });
                    return;
                }
            });
        });
    };

    // 关键字查询
    searchKeyChnage = (e) => {
        const value = e.target.value;
        this.setState(
            {
                keyValue: value,
            },
            () => {
                if (this.searchFlag) {
                    clearTimeout(this.searchFlag);
                    this.searchFlag = false;
                }
                this.searchFlag = setTimeout(() => {
                    this.props.getChargeList(value);
                }, 800);
            }
        );
    };

    handleAccountSelect = (key, event) => {
        this.setState({
            chargeList: key.payChargeItemMapperModelList,
            name: key.accountName,
        });
    };

    render() {
        const { chargeList, mainList, checkedList, keyValue } = this.state;
        return (
            <div className={styles.addPro} ref={(ref) => (this.mainBox = ref)}>
                <div className={styles.selectBox}>
                    <div className={styles.searchStudent}>
                        <Input
                            placeholder={trans('charge.numberSearch', '输入项目名称或编号搜索')}
                            value={keyValue}
                            style={{ width: '100%' }}
                            size="large"
                            onChange={this.searchKeyChnage}
                        />
                    </div>
                    <div className={styles.selectTree}>
                        <div className={styles.select}>
                            {mainList && mainList.length
                                ? mainList.map((item, index) => {
                                    let disabled = 'auto';
                                    let count = '';
                                    if (!(checkedList && checkedList.length)) {
                                        // 无收费项目选中，用户可以选择
                                        disabled = 'auto';
                                    } else if (
                                        JSON.stringify(chargeList) !=
                                        JSON.stringify(item.payChargeItemMapperModelList)
                                    ) {
                                        // 收费项目列表与当前选中用户下的收费项目对比，不相等择则禁止选中
                                        disabled = 'none';
                                    } else if (
                                        JSON.stringify(chargeList) ==
                                        JSON.stringify(item.payChargeItemMapperModelList)
                                    ) {
                                        // 收费项目列表与当前选中用户下的收费项目对比，相等择则显示勾选项数量
                                        count = checkedList.length;
                                    }
                                    return (
                                        <div
                                            style={{ pointerEvents: disabled }}
                                            key={JSON.stringify(
                                                item.payChargeItemMapperModelList
                                            )}
                                            className={[
                                                styles.treeNode,
                                                this.state.name &&
                                                    this.state.name === item.accountName
                                                    ? styles.clickNode
                                                    : null,
                                            ].join(' ')}
                                            onClick={this.handleAccountSelect.bind(this, item)}
                                        >
                                            <span
                                                className={styles.name}
                                                title={item.accountName}
                                            >
                                                {item.accountName}
                                            </span>
                                            <span className={styles.count}>{count}</span>
                                        </div>
                                    );
                                })
                                : null}
                        </div>
                        <div className={styles.checkbox}>
                            <Checkbox
                                className={styles.checkAll}
                                value={null}
                                key={0}
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChargeChange}
                                checked={this.state.checkAll}
                            >
                                {trans('charge.allPayService', '所有收费项目')}
                            </Checkbox>
                            <Checkbox.Group
                                // style={{ width: '370px' }}
                                onChange={this.changeItemList}
                                value={checkedList}
                            >
                                {chargeList && chargeList.length
                                    ? chargeList.map((item, index) => {
                                        return (
                                            <Checkbox
                                                // value={JSON.stringify({chargeItemNo:item.chargeItemNo,price:item.price,name:item.name})}
                                                value={JSON.stringify(item)}
                                                key={item.chargeItemNo}
                                            >
                                                <span className={styles.chargeBox}>
                                                    <span
                                                        className={styles.chargeName}
                                                        title={item.name}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    <span className={styles.chargeNo}>
                                                        （{item.chargeItemNo}）
                                                    </span>
                                                    <span className={styles.chargePrice}>
                                                        ￥{item.price}
                                                    </span>
                                                </span>
                                            </Checkbox>
                                        );
                                    })
                                    : null}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
