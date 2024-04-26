import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Dropdown, Tree } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './index.less';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const treeMap = {};

export default class Index extends PureComponent {
    state = {
        dropVisible: false,
        checkListId: this.props.selectTeacherType == 'edit' ? this.props.mainTeacherId : [],
        checkListLabel: this.props.selectTeacherType == 'edit' ? this.props.mainTeacherLabel : [],
        treeKeys: [],
    };

    onSearch = (keyWord) => {
        this.props.onSearch.call(this, keyWord);
    };

    componentDidMount() {
        this.props.onRef(this);
    }

    rendChildren = () => {
        let { treeData } = this.props;
        const children = [];
        treeData &&
            treeData.length > 0 &&
            treeData.map((el, index) => {
                children.push(
                    <Option checked value={el.teacherId}>
                        {el.name + ' ' + el.englishName}
                    </Option>
                );
            });
        return children;
    };

    onVisibleChange(visible) {
        this.setState({
            dropVisible: visible,
        });
    }

    renderDown() {
        let { department } = this.props;
        return (
            <div className={styles.dropTree}>
                <Tree checkable onCheck={this.treeCheck} checkedKeys={this.state.treeKeys}>
                    {this.renderTreeNodes(department, [])}
                </Tree>
            </div>
        );
    }

    updateList = (node) => {
        let { checkListId, checkListLabel } = this.state;
        let newCheckListId = checkListId.concat(),
            newCheckListLabel = checkListLabel.concat();

        if (node && node.length > 0) {
            node.map((el) => {
                let { props } = el;
                let userId = props.value;
                if (userId && newCheckListId.indexOf(userId) < 0) {
                    newCheckListId.push(userId);
                    newCheckListLabel.push(props.label);
                }
            });
        }
        this.setState({
            checkListId: newCheckListId,
            checkListLabel: newCheckListLabel,
        });
    };

    deleCheck = (nodes) => {
        let checkListId = this.state.checkListId.concat(),
            checkListLabel = this.state.checkListLabel.concat(),
            treeKeys = this.state.treeKeys.concat(),
            allValues = [],
            parentIds = [],
            getAllLeafTitle = (nodes) => {
                if (nodes.children && nodes.children.length > 0) {
                    parentIds.push(nodes.dataRef.key);

                    nodes.children.map((el) => {
                        getAllLeafTitle(el.props);
                    });
                } else {
                    allValues.push(nodes.value);
                }
            };

        getAllLeafTitle(nodes);
        //叶子结点父id处理
        treeMap[nodes.value] &&
            treeMap[nodes.value].length > 0 &&
            (parentIds = parentIds.concat(treeMap[nodes.value]));

        //非叶子结点父id处理
        nodes['dataRef'] &&
            treeMap[nodes['dataRef']['key']] &&
            treeMap[nodes['dataRef']['key']].length > 0 &&
            (parentIds = parentIds.concat(treeMap[nodes['dataRef']['key']]));

        parentIds.length > 0 &&
            parentIds.map((el) => {
                let parentIndex = treeKeys.indexOf(el);
                parentIndex > -1 && treeKeys.splice(parentIndex, 1);
            });

        if (allValues.length > 0) {
            allValues.map((el) => {
                let index = checkListId.indexOf(el),
                    treeIndex = treeKeys.indexOf(el);
                if (index > -1) {
                    checkListId.splice(index, 1);
                    checkListLabel.splice(index, 1);
                }
                treeIndex > -1 && treeKeys.splice(treeIndex, 1);
            });
        }
        this.setState({
            checkListId,
            checkListLabel,
            treeKeys,
        });
        // this.props.onChange.call(this, checkListId);
    };

    treeCheck = (keys, e) => {
        let nodes = e.checkedNodes;
        if (e.checked) {
            this.updateList(nodes);
            this.setState({
                treeKeys: [...new Set(keys)],
            });
        } else {
            this.deleCheck(e.node.props);
        }
    };
    renderTreeNodes = (department, ids) => {
        var parentIds = ids || [];

        return (
            department &&
            department.length > 0 &&
            department.map((item, i) => {
                let newItem = {
                    title: item.label,
                    ...item,
                };
                if (item.children) {
                    parentIds && parentIds.length > 0 && (treeMap[item.key] = parentIds);

                    parentIds.push(item.key);
                    return (
                        <TreeNode
                            title={item.label}
                            key={item.key}
                            selectable={false}
                            dataRef={newItem}
                        >
                            {this.renderTreeNodes(item.children, parentIds)}
                        </TreeNode>
                    );
                }
                if (treeMap[item.key] && treeMap[item.key].length > 0) {
                    treeMap[item.key] = treeMap[item.key].concat(parentIds);
                } else {
                    treeMap[item.key] = parentIds;
                }
                return <TreeNode selectable={false} key={item.key + '-' + i} {...newItem} />;
            })
        );
    };

    selectCheck = (val, e) => {
        let treeKeys = this.state.treeKeys.concat();
        this.updateList([
            {
                props: {
                    value: val,
                    label: e.props.children,
                },
            },
        ]);

        if (treeKeys.indexOf(val) < 0) {
            treeKeys.push(val);
            this.setState({ treeKeys });
        }
    };
    deSelectCheck = (val) => {
        let checkListId = this.state.checkListId.concat(),
            checkListLabel = this.state.checkListLabel.concat(),
            treeKeys = this.state.treeKeys.concat(),
            index = checkListLabel.indexOf(val),
            kIndex = -1;

        if (index > -1) {
            kIndex = treeKeys.indexOf(checkListId[index]);
            kIndex > -1 && treeKeys.splice(kIndex, 1);
            checkListId.splice(index, 1);
            checkListLabel.splice(index, 1);

            //删除计数
            let operRemark = ++this.state.operRemark;

            this.setState({
                checkListId,
                checkListLabel,
                treeKeys,
                operRemark,
            });
            this.props.onChange.call(this, checkListId);
        }
    };

    onSearch(keyWord) {
        this.props.onSearch.call(this, keyWord);
    }

    render() {
        const { allTeacher } = this.props;
        console.log(this.state.checkListId, 'this.state.checkListId');
        return (
            <div className={styles.userSelect}>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    filterOption={false}
                    placeholder={this.props.placeholder}
                    onSearch={this.onSearch}
                    value={this.state.checkListLabel}
                    onSelect={this.selectCheck}
                    onDeselect={this.deSelectCheck}
                    onSearch={this.onSearch.bind(this)}
                >
                    {this.rendChildren()}
                </Select>
                <Dropdown
                    visible={this.state.dropVisible}
                    onVisibleChange={this.onVisibleChange.bind(this)}
                    overlay={this.renderDown()}
                    trigger={['click']}
                >
                    <i
                        className={
                            styles.rightIcon +
                            ' ' +
                            styles.iconfont +
                            ' ' +
                            styles['icon-zuzhijiagou']
                        }
                    ></i>
                </Dropdown>
            </div>
        );
    }
}
