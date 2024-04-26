//组织树
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import 'react-sortable-tree/style.css';
import icon from '../../icon.less';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import { Input, Switch } from 'antd';
const { Search } = Input;

export default class SortableTreeUtil extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            searchFocusIndex: 0,
            searchFoundCount: null,
            checked: false,
            saveSelectStatus: { 1: true },
        };
    }

    //change 树操作
    handleTreeOnChange = (treeData) => {
        const { handleExpand } = this.props;
        typeof handleExpand == 'function' && handleExpand.call(this, treeData);
    };

    //tree展开关闭操作
    expandTreeChange = (treeData) => {
        const { saveTreeExpand } = this.props;
        typeof saveTreeExpand == 'function' && saveTreeExpand.call(this, treeData);
    };

    handleSearchOnChange = (value) => {
        this.setState({
            searchString: value,
        });
    };

    selectPrevWatch = () => {
        const { searchFocusIndex, searchFoundCount } = this.state;
        this.setState({
            searchFocusIndex:
                searchFocusIndex !== null
                    ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
                    : searchFoundCount - 1,
        });
    };

    selectNextWatch = () => {
        const { searchFocusIndex, searchFoundCount } = this.state;
        this.setState({
            searchFocusIndex:
                searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0,
        });
    };

    //查询
    searchFinishCallback = (matches) => {
        this.setState({
            searchFoundCount: matches.length,
            searchFocusIndex: matches.length > 0 ? this.state.searchFocusIndex % matches.length : 0,
        });
    };

    //获取节点id
    getNodeId(info) {
        const { getSearchNodeId } = this.props;
        let saveSelectStatus = {};
        saveSelectStatus[info.node.id] = true;
        this.setState({
            saveSelectStatus: saveSelectStatus,
        });
        typeof getSearchNodeId == 'function' && getSearchNodeId.call(this, info);
    }

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

    render() {
        const { dataSource, isShowSwitch } = this.props;
        const { searchString, searchFocusIndex, searchFoundCount, checked, saveSelectStatus } =
            this.state;
        return (
            <div className={styles.treeWrapper}>
                <Search
                    placeholder="请输入关键字"
                    onSearch={(value) => this.handleSearchOnChange(value)}
                    className={styles.searchInput}
                />
                {isShowSwitch && (
                    <div className={styles.switcOnlyOrg}>
                        <Switch checked={checked} onChange={this.changeSwitch} />
                        <span>查看全部组织</span>
                    </div>
                )}
                <SortableTree
                    treeData={dataSource}
                    onChange={this.handleTreeOnChange}
                    onVisibilityToggle={this.expandTreeChange}
                    maxDepth={5}
                    className={styles.sortableTree}
                    searchQuery={searchString}
                    //searchFocusOffset={searchFocusIndex}
                    canDrag={({ node }) => {
                        return false;
                    }}
                    canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
                    searchFinishCallback={(matches) => this.searchFinishCallback(matches)}
                    isVirtualized={true}
                    generateNodeProps={(rowInfo) => ({
                        buttons: [
                            <span
                                className={
                                    saveSelectStatus[rowInfo.node.id] == true
                                        ? styles.activeButton
                                        : styles.setButton
                                }
                                onClick={this.getNodeId.bind(this, rowInfo)}
                            >
                                <i className={icon.iconfont}>&#xe6b3;</i>
                            </span>,
                        ],
                    })}
                    onlyExpandSearchedNodes={true}
                />
            </div>
        );
    }
}
