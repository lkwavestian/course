//机构管理--组织架构
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import SortableTree from 'components/SortableTree/index';
import { Checkbox, Select, Input, Pagination, message, Dropdown, Menu, Modal } from 'antd';
import icon from '../../../icon.less';
import CreateOrg from './OperModal/createOrg';
import SetOrgRole from '../../Student/Management/OperModal/setOrgRole';
import PowerPage from '../../PowerPage/index';
import { trans, locale } from '../../../utils/i18n';

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

@connect((state) => ({
    treeDataList: state.organize.treeDataList,
    orgInfoById: state.teacher.teacherOrgInfoById, //部门的详细信息
}))
export default class FrameworkComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkValue: true, //是否显示子部门员工
            searchValue: undefined, //模糊搜索
            treeId: 1, //树节点id
            tagCode: 0, //部门人员总人数
            current: 1, //当前页数
            pageSize: 20,
            rowKeys: [], //table选中的id
            rowIds: [], //table选中的id
            createOrgVisible: false, //新建组织&&编辑组织
            createOrgType: 'create', //新建组织的类型
            setOrgRoleVisible: false, //设置组织角色
            currentLanguage: 'cn',
        };
    }

    componentWillMount() {
        this.getTreeOrgFirst();
        //获取最顶层节点的详情
        this.fetchTreeNodeDetail();
    }

    componentWillUnmount() {
        this.clearData();
    }

    componentDidMount() {
        this.setState({
            currentLanguage: locale(),
        });
    }

    //清空数据
    clearData = () => {
        const { dispatch } = this.props;
        this.setState({
            treeId: '',
            createOrgType: 'create',
        });
        dispatch({
            type: 'student/clearData',
            payload: {},
        });
        dispatch({
            type: 'teacher/clearData',
            payload: {},
        });
    };

    //格式化树结构
    formatTreeData = (data, type) => {
        if (!data || data.length == 0) return [];
        data.map((item, index) => {
            item.title = `${item.name}（${item.userCount || 0}）`;
            item.children = this.formatTreeData(item.treeNodeList, 'son');
            if (index == 0 && type == 'parent') {
                item.expanded = true;
            } else {
                item.expanded = false;
            }
        });
        return data;
    };

    //初始化获取组织结构树
    getTreeOrgFirst() {
        const { dispatch } = this.props;
        dispatch({
            type: 'organize/getOrganizeList',
            payload: {
                nodeId: 1, //临时写死
                ifContainUser: true, //是否包含用户
            },
            onSuccess: () => {
                const { treeDataList } = this.props;
                let content = treeDataList.content || [];
                let id = content.length > 0 ? content[0].id : 1;
                let tagCode = content.length > 0 ? content[0].tagCode : 0;
                this.setState({
                    dataSource: treeDataList.content,
                    treeId: id,
                    tagCode,
                });
            },
        });
    }

    //获取组织结构树---延时处理
    getTreeOrg() {
        const { dispatch } = this.props;
        let self = this;
        setTimeout(function () {
            dispatch({
                type: 'organize/getOrganizeList',
                payload: {
                    nodeId: 1, //临时写死
                    ifContainUser: true, //是否包含用户
                },
                onSuccess: () => {
                    const { treeDataList } = self.props;
                    self.setState({
                        dataSource: treeDataList.content,
                    });
                },
            });
        }, 300);
    }

    //获取点击的树节点
    getSearchNodeId = (selectedKeys) => {
        let keys = selectedKeys[0] ? selectedKeys[0].split('-') : '';
        if (!keys) return false;
        this.setState(
            {
                treeId: keys && keys[0],
                tagCode: keys && keys[1],
            },
            () => {
                //根据节点查询信息
                this.fetchTreeNodeDetail();
            }
        );
    };

    //根据树节点查询详细信息
    fetchTreeNodeDetail = () => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'teacher/getOrgInfoById',
            payload: {
                nodeId: this.state.treeId,
            },
            onSuccess: () => {
                this.getTeacherList();
            },
        });
    };

    //是否勾选子部门员工
    changeCheckbox = (e) => {
        this.setState(
            {
                checkValue: e.target.checked,
            },
            () => {
                this.getTeacherList();
            }
        );
    };

    //输入搜索条件搜索
    handleSearch = (value) => {
        this.setState(
            {
                searchValue: value,
            },
            () => {
                this.getTeacherList();
            }
        );
    };

    //获取员工列表
    getTeacherList = () => {
        const { dispatch } = this.props;
        const { treeId, searchValue, checkValue, pageSize, current } = this.state;
        if (!treeId) {
            message.info('请先选择一个组织再操作哦~');
            return false;
        }
        dispatch({
            type: 'teacher/getTeacherList',
            payload: {
                nodeId: treeId, //树节点id
                keyWord: searchValue || '', //关键字
                ifShowSub: checkValue, //是否显示子部门员工
                pageSize: pageSize,
                pageNum: current,
            },
        }).then(() => {
            this.setState({
                rowKeys: [],
                rowIds: [],
            });
        });
    };

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getTeacherList();
            }
        );
    };

    //切换每页条数
    switchPageSize = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getTeacherList();
            }
        );
    };

    //统计table选中的项
    fetchRowKeys = (keys, rowIds) => {
        this.setState({
            rowKeys: keys,
            rowIds: rowIds,
        });
    };

    //格式化部门中的角色
    formatRoleList = (detail) => {
        if (!detail || detail.length == 0) return '---';
        return detail.map((item) => {
            return (
                <em key={item.id}>
                    {this.state.currentLanguage !== 'en' ? item.name : item.ename}
                </em>
            );
        });
    };

    //新建组织
    createOrg(type) {
        if (!this.state.treeId) {
            message.info('请先选择一个组织再操作哦~');
            return false;
        }
        this.setState({
            createOrgVisible: true,
            createOrgType: type,
        });
    }

    //隐藏modal
    hideModal = (type) => {
        switch (type) {
            case 'createOrg':
                this.setState({
                    createOrgVisible: false,
                });
                break;
            case 'setOrgRole':
                this.setState({
                    setOrgRoleVisible: false,
                });
                break;
        }
    };

    //设置组织角色
    setOrganizationRole = () => {
        if (!this.state.treeId) {
            message.info('请选择一个组织再操作哦~');
            return false;
        }
        this.setState({
            setOrgRoleVisible: true,
        });
    };

    render() {
        const { orgInfoById, treeDataList } = this.props;
        const { tagCode, currentLanguage } = this.state;
        let orgInfo = orgInfoById || {};
        let havePower = treeDataList.unauthorized; //判断用户是否有权限
        if (havePower === true) {
            //用户暂无权限
            return (
                <div className={styles.frameworkPage}>
                    <PowerPage />
                </div>
            );
        }
        return (
            <div
                className={
                    window.top != window.self
                        ? `${styles.frameworkPage} ${styles.fullPage}`
                        : styles.frameworkPage
                }
            >
                <div className={styles.leftBar}>
                    <SortableTree
                        {...this.state}
                        {...this.props}
                        getSearchNodeId={this.getSearchNodeId}
                        getTreeOrg={this.getTreeOrgFirst.bind(this)}
                    />
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoDetail}>
                            <div className={styles.infoTitle}>
                                <p>
                                    <span className={styles.orgName}>
                                        {currentLanguage !== 'en'
                                            ? orgInfo.name || '--'
                                            : orgInfo.ename}
                                        {/* {orgInfo.name || '--'} {orgInfo.ename} */}
                                    </span>
                                    <span>
                                        {currentLanguage !== 'en'
                                            ? orgInfo.orgTagName
                                            : orgInfo.orgTagCode}
                                    </span>
                                    <a
                                        className={styles.editOrgBtn}
                                        onClick={this.createOrg.bind(this, 'edit')}
                                    >
                                        {trans('global.edit', '编辑')}
                                    </a>
                                </p>
                            </div>
                            <div className={styles.infoOther}>
                                <p>
                                    {orgInfo.orgRoleList &&
                                        orgInfo.orgRoleList.length > 0 &&
                                        orgInfo.orgRoleList.map((item, index) => {
                                            return (
                                                <span key={index}>
                                                    {item.leader == true && (
                                                        <i
                                                            className={
                                                                icon.iconfont +
                                                                ' ' +
                                                                styles.isLeader
                                                            }
                                                        >
                                                            &#xe74d;
                                                        </i>
                                                    )}
                                                    {currentLanguage !== 'en'
                                                        ? item.name
                                                        : item.code}
                                                    ：{this.formatRoleList(item.userList)}{' '}
                                                </span>
                                            );
                                        })}
                                    {tagCode != 'CLASSIFY_NODE' && (
                                        <a
                                            className={styles.setOrgBtn}
                                            onClick={this.setOrganizationRole}
                                        >
                                            {trans('organization.setRole', '设置角色')}
                                        </a>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className={styles.infoOperation}>
                            {/* <span className={styles.getDd}>升年级</span> */}
                            <span
                                className={styles.createOrgBtn}
                                onClick={this.createOrg.bind(this, 'create')}
                            >
                                <i className={icon.iconfont}>&#xe75a;</i>
                                {trans('student.createOrg', '新建组织')}
                            </span>
                        </div>
                    </div>
                    <div className={styles.infoTable}></div>
                </div>

                <CreateOrg
                    {...this.state}
                    hideModal={this.hideModal}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    clearData={this.clearData}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                />
                <SetOrgRole
                    {...this.state}
                    hideModal={this.hideModal}
                    orgInfo={orgInfo}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                />
            </div>
        );
    }
}
