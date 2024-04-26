//组织树
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../icon.less';
import { Input, Switch, Tree, Icon, Select } from 'antd';
import { trans, locale } from '../../utils/i18n';
import Item from 'antd/lib/list/Item';

const { Search } = Input;
const { TreeNode } = Tree;
const { Option } = Select;

const dataList = [];

export default class SortableTreeUtil extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            expandKeysList: [],
            autoExpandParent: true,
            checked: false,
            selectedKeys: ['1-AGENCY-false'],
        };
    }

    onSelect = (selectedKeys, info) => {
        console.log(selectedKeys, 'selectedKeys');
        this.setState(
            {
                selectedKeys:
                    selectedKeys && selectedKeys.length > 0
                        ? selectedKeys
                        : this.state.selectedKeys,
            },
            () => {
                const { getSearchNodeId } = this.props;
                typeof getSearchNodeId == 'function' && getSearchNodeId.call(this, selectedKeys);
            }
        );
    };

    //查看全部组织开关
    changeSwitch = (checked) => {
        this.setState(
            {
                checked: checked,
            },
            () => {
                const { getIsShowSwitch } = this.props;
                typeof getIsShowSwitch == 'function' && getIsShowSwitch.call(this, checked);
            }
        );
    };

    //搜索处理
    handleSearchChange = (value) => {
        const { dataSource } = this.props;
        const keyList = [];
        this.formatTree(dataSource);
        dataList.map((item) => {
            if (item.name.indexOf(value) > -1) {
                keyList.push(`${item.id}`);
            }
        });
        this.setState({
            searchValue: value,
            expandKeysList: keyList,
            autoExpandParent: true,
        });
    };

    //将树状结构处理成id，name的数组对象
    formatTree = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            const node = arr[i];
            let name = locale() != 'en' ? node.name : node.englishName;
            dataList.push({
                id: `${node.id}-${node.tagCode}-${node.isLeaf}`,
                name: `${name}（${node.userCount}）`,
            });
            if (node.treeNodeList) {
                this.formatTree(node.treeNodeList);
            }
        }
    };

    //处理节点
    handleData = (data) => {
        const { searchValue } = this.state;
        const { source } = this.props;
        if (!data || data.length == 0) return;
        return data.map((item) => {
            let name = locale() != 'en' ? item.name : item.englishName;
            const index = `${name}（${item.userCount}）`.indexOf(searchValue);
            const beforeStr = `${name}（${item.userCount}）`.substr(0, index);
            const afterStr = `${name}（${item.userCount}）`.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: '#f50' }}>{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{`${name}（${item.userCount}）`}</span>
                );
            if (item.treeNodeList) {
                return (
                    <TreeNode
                        key={
                            source && source === 'student'
                                ? `${item.id}-${item.tagCode}-${item.isLeaf}-${item.studentGroupId}`
                                : `${item.id}-${item.tagCode}-${item.isLeaf}`
                        }
                        title={title}
                        icon={<Icon type="apartment" />}
                    >
                        {this.handleData(item.treeNodeList)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={
                        source && source === 'student'
                            ? `${item.id}-${item.tagCode}-${item.isLeaf}-${item.studentGroupId}`
                            : `${item.id}-${item.tagCode}-${item.isLeaf}`
                    }
                    title={title}
                    icon={<Icon type="apartment" />}
                />
            );
        });
    };

    //展开树
    onExpand = (expandedKeys, obj) => {
        this.setState({
            expandKeysList: expandedKeys,
            autoExpandParent: false,
        });
    };

    //比较两个数组不一样的元素
    diffArray(arr1, arr2) {
        let arr3 = [];
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) === -1) {
                arr3.push(arr1[i]);
            }
        }
        for (let j = 0; j < arr2.length; j++) {
            if (arr1.indexOf(arr2[j]) === -1) {
                arr3.push(arr2[j]);
            }
        }
        return arr3;
    }

    //获取树节点id
    getTreeNodeIds(trees) {
        if (!trees || trees.length == 0) return;
        let firstId = trees[0] && `${trees[0].id}-${trees[0].tagCode}-${trees[0].isLeaf}`,
            secondId =
                trees[0] &&
                trees[0].treeNodeList &&
                trees[0].treeNodeList[0] &&
                `${trees[0].treeNodeList[0].id}-${trees[0].treeNodeList[0].tagCode}-${trees[0].treeNodeList[0].isLeaf}`;
        if (this.props.source && this.props.source === 'student') {
            // console.log(trees,'trees12');
            var idArray = [];
            trees.map((item, index) => {
                item.treeNodeList &&
                    item.treeNodeList.length &&
                    item.treeNodeList.length > 0 &&
                    item.treeNodeList.map((item1, index1) => {
                        item1.treeNodeList &&
                            item1.treeNodeList.length &&
                            item1.treeNodeList.length > 0 &&
                            item1.treeNodeList.map((item2, index2) => {
                                idArray.push(
                                    `${item2.id}-${item2.tagCode}-${item2.isLeaf}-${item2.studentGroupId}`
                                );
                            });
                    });
            });
            // (firstId =
            //     trees[0] &&
            //     `${trees[0].id}-${trees[0].tagCode}-${trees[0].isLeaf}-${trees[0].studentGroupId}`),
            //     (secondId =
            //         trees[0] &&
            //         trees[0].treeNodeList &&
            //         trees[0].treeNodeList[0] &&
            //         `${trees[0].treeNodeList[0].id}-${trees[0].treeNodeList[0].tagCode}-${trees[0].treeNodeList[0].isLeaf}-${trees[0].treeNodeList[0].studentGroupId}`);
        }
        if (this.props.source && this.props.source === 'student') {
            return idArray;
        } else {
            return [firstId, secondId];
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.dataSource) != JSON.stringify(this.props.dataSource)) {
            if (
                (this.state.expandKeysList && !this.state.expandKeysList.length) ||
                !this.state.expandKeysList
            ) {
                if (nextProps.createOrgType != 'edit') {
                    this.setState({
                        expandKeysList: this.getTreeNodeIds(nextProps.dataSource),
                    });
                }
            }
            let data = this.handleData(nextProps.dataSource);
            this.initKey(data);
        }
    }

    componentDidMount() {
        this.setState({
            expandKeysList: this.getTreeNodeIds(this.props.dataSource),
        });
    }

    initKey = (data) => {
        let arr = [];
        if (data && data.length > 0) {
            let key = data[0] && data[0].key;
            this.setState({
                selectedKeys: [`${key}`],
            });
        }
    };

    render() {
        const {
            dataSource,
            isShowSwitch,
            statusType,
            listSchooliSelectInfo,
            listSchoolYearSelectInfo,
            selectSchoolId,
            selectSchooYearlId,
            isSelectSchoolOnly,
        } = this.props;
        const { checked, expandKeysList, autoExpandParent } = this.state;
        // console.log(expandKeysList, 'loop2');
        let loop = this.handleData(dataSource);
        // console.log(loop, 'loop2');
        let searchInput =
            statusType == 1 && !isSelectSchoolOnly ? styles.searchInput : styles.searchInputLong;
        return (
            <div className={styles.treeWrapper}>
                {statusType == 1 && (
                    <Select
                        value={selectSchoolId}
                        className={styles.schoolSelect}
                        onChange={(value) => {
                            const { changeSelectSchool } = this.props;
                            typeof changeSelectSchool === 'function' && changeSelectSchool(value);
                            this.setState({
                                selectedKeys: ['1-AGENCY-false'],
                            });
                        }}
                        // allowClear
                        placeholder="全部校区"
                    >
                        {listSchooliSelectInfo &&
                            listSchooliSelectInfo.length > 0 &&
                            listSchooliSelectInfo.map((item, index) => {
                                return (
                                    <Option value={item.schoolId} key={item.schoolId}>
                                        {locale() != 'en' ? item.name : item.enName}
                                    </Option>
                                );
                            })}
                    </Select>
                )}
                {statusType == 1 && !isSelectSchoolOnly && (
                    <Select
                        value={selectSchooYearlId}
                        onChange={this.props.changeSelectSchoolYear}
                        className={styles.schoolYearSelect}
                    >
                        {listSchoolYearSelectInfo &&
                            listSchoolYearSelectInfo.length > 0 &&
                            listSchoolYearSelectInfo.map((item, index) => {
                                return (
                                    <Option value={item.id} key={item.id}>
                                        {locale() == 'en' ? item.ename : item.name}
                                    </Option>
                                );
                            })}
                    </Select>
                )}

                <Search
                    placeholder={trans('global.inputKeyword', '请输入关键字')}
                    onSearch={(value) => this.handleSearchChange(value)}
                    className={searchInput}
                />
                {isShowSwitch && statusType == 1 && (
                    <div className={styles.switchOnlyOrg}>
                        <Switch checked={checked} onChange={this.changeSwitch} />
                        <span>{trans('global.lookAllOrgs', '查看全部组织')}</span>
                    </div>
                )}
                <Tree
                    showIcon
                    switcherIcon={<Icon type="caret-down" />}
                    onSelect={this.onSelect}
                    onExpand={this.onExpand}
                    defaultSelectedKeys={['1-AGENCY-false']}
                    expandedKeys={expandKeysList}
                    autoExpandParent={autoExpandParent}
                    selectedKeys={this.state.selectedKeys}
                >
                    {loop}
                </Tree>
            </div>
        );
    }
}
