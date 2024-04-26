//部门选择组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Tree, Icon, TreeSelect } from 'antd';
import { trans, locale } from '../../../../utils/i18n';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;
import lodash from 'lodash';
import styles from './index.less';
import { SearchTeacher } from '@yungu-fed/yungu-selector';
import { PlusOutlined } from '@ant-design/icons';

export default class DepartmentSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            teacherIds: [],
            roleIds: [],
            identity: 'teacher',
            role: '',
            selectTeacherModalVisible: false,
            userIds: [],
            orgIds: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.teacherIds != nextProps.teacherIds) {
            const teacherIds =
                nextProps &&
                nextProps.teacherIds &&
                nextProps.teacherIds.map((item) => {
                    item = 'user-' + item;
                    return item;
                });
            console.log('nextProps :>> ', nextProps);
            if (nextProps.referenceSource == 'rule') {
                this.setState({
                    teacherIds,
                });
            }
        }
    }

    //获取orgId
    getIds = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultId = [];
        arr.map((item) => {
            resultId.push(`org-${item.id}`);
        });
        return resultId;
    };

    identityChange = (identity) => {
        console.log('identity :>> ', identity);
        this.setState({
            identity,
        });
        this.props.identityChange.call(this, identity);
    };

    //选中select值
    teacherChange = (teacherIds) => {
        console.log(teacherIds, 'teacherIds');
        this.setState({ teacherIds });
        this.props.onTeacherChange.call(this, teacherIds);
    };

    roleChange = (roleIds) => {
        console.log(roleIds, 'roleIds');
        this.setState({ roleIds });
        this.props.onRoleChange.call(this, roleIds);
    };

    //处理树节点
    handleTree(arr, title) {
        const { referenceSource } = this.props;

        if (arr && arr.length < 0) return;

        let newArr = [];
        arr &&
            arr.map((el) => {
                let obj = {};
                obj.title = el.label;
                obj.key = el.orgTreeId ? 'org-' + el.orgTreeId : 'user-' + el['key'];
                obj.value = el.orgTreeId ? 'org-' + el.orgTreeId : 'user-' + el['key'];
                obj.searchTitle = el.label + '-' + title;
                if (el.children) {
                    obj.children = this.handleTree(el.children, obj.searchTitle);
                } else {
                    if (referenceSource != 'rule') {
                        obj.disabled = true;
                    }
                }
                newArr.push(obj);
            });
        return newArr;
    }

    getDefaultExpandedKeys = () => {
        const { treeData } = this.props;
        const newTreeData = this.handleTree(treeData, '');
        const keyList = [];
        newTreeData.map((item, index) => {
            keyList.push(item.key);
            item.children &&
                item.children.map((el, i) => {
                    keyList.push(el.key);
                });
        });

        return keyList;
    };

    changeSelectTeacherModalVisible = (visible) => {
        this.setState({
            selectTeacherModalVisible: visible ?? false,
        });
    };

    /* selectTeacherConfirm = (ids) => {
        //获得组织和人员id {orgIds: [], userIds: [] }
        console.log('selectTeacherConfirm ids', ids);
        let idList = JSON.parse(JSON.stringify(ids));
        let orgIds = idList?.orgIds || [], //组织ids
            userIds = idList?.userIds || []; //人员ids
        for (let i = 0; i < userIds.length; i++) {
            userIds[i] = `user-${userIds[i]}`;
        }
        for (let i = 0; i < orgIds.length; i++) {
            orgIds[i] = `org-${orgIds[i]}`;
        }
        console.log(
            'Array.from(new Set(orgIds.concat(userIds))) :>> ',
            Array.from(new Set(orgIds.concat(userIds)))
        );
        this.setState(
            {
                teacherIds: Array.from(new Set(orgIds.concat(userIds))),
            },
            () => {
                this.setState({
                    userIds: this.formatId(this.state.teacherIds, 'user'),
                    orgIds: this.formatId(this.state.teacherIds, 'org'),
                });
                console.log('this.state.teacherIds :>> ', this.state.teacherIds);
                this.props.onTeacherChange.call(this, this.state.teacherIds);
                this.changeSelectTeacherModalVisible(false);
            }
        );
    }; */

    selectTeacherConfirm = (ids) => {
        //获得组织和人员id {orgIds: [], userIds: [] }
        console.log('selectTeacherConfirm ids', ids);
        console.log('Array.from(new Set(userIds))', Array.from(new Set(ids)));
        this.setState(
            {
                teacherIds: Array.from(new Set(ids)),
            },
            () => {
                console.log('this.state.teacherIds :>> ', this.state.teacherIds);
                this.props.onTeacherChange.call(
                    this,
                    this.state.teacherIds.map((item) => `userIds-${item}`)
                );
                this.changeSelectTeacherModalVisible(false);
            }
        );
    };

    formatId = (list, type) => {
        let org = [],
            user = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] && typeof list[i] == 'string' && list[i].indexOf('org-') > -1) {
                let id = Number(list[i].split('org-')[1]);
                org.push(id);
            } else {
                user.push(list[i]);
            }
        }
        if (type == 'org') {
            return org;
        } else if (type == 'user') {
            return user;
        }
        console.log('formatId :>> ', org, user);
    };

    //处理回显数据
    handleData = (data) => {
        console.log('handleData data :>> ', data);
        let tree = this.formatTree();
        let result = [];
        let newData = data.map((item) => {
            if (typeof item === 'string') {
                return Number(item.slice(5));
            } else {
                return item;
            }
        });
        for (let i = 0; i < newData.length; i++) {
            for (let j = 0; j < tree.length; j++) {
                if (tree[j]['id'] == newData[i]) {
                    let info = {
                        id: newData[i],
                        name: tree[j]['name'],
                        englishName: tree[j]['enName'],
                        total: tree[j]['total'] || 0,
                    };
                    result.push(info);
                }
            }
        }
        return result;
    };

    //处理人员和组织数据-人员和组织的id有重复的，所以组织的id添加org-标识
    formatTree = () => {
        const { fetchTeacherAndOrg } = this.props;
        let tree = JSON.parse(JSON.stringify(fetchTeacherAndOrg || []));
        tree.map((item) => {
            item.id = item.orgFlag ? `org-${item.id}` : item.id;
        });
        return tree;
    };

    render() {
        let { selectTeacherModalVisible, teacherIds } = this.state;
        let {
            treeData,
            teacherViewOrgDisabled,
            inputWidth,
            referenceSource,
            roleTag,
            identity,
            tagList,
        } = this.props;
        let orgSource = this.handleTree(treeData, '');

        const tProps = {
            treeData: orgSource,
            value: this.state.teacherIds,
            onChange: this.teacherChange,
            treeCheckable: true,
            showCheckedStrategy: referenceSource == 'rule' ? SHOW_CHILD : SHOW_PARENT,
            treeNodeFilterProp: 'searchTitle',
            searchPlaceholder: this.props.placeholder,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            style: { width: 260 },
            placeholder:
                referenceSource == 'rule'
                    ? trans('global.Search or select teachers', '搜索或选择教师')
                    : trans('global.searchDepartments', '按部门筛选'),
            disabled: teacherViewOrgDisabled,
            treeDefaultExpandedKeys: this.getDefaultExpandedKeys(),
        };
        return (
            <div style={{ display: 'flex' }}>
                <Select
                    onChange={this.identityChange}
                    defaultValue="teacher"
                    value={identity}
                    style={{ width: 80 }}
                >
                    <Option value="teacher">{trans('global.Teachers', '教师')}</Option>
                    <Option value="role">{trans('global.Roles', '角色')}</Option>
                </Select>
                {identity === 'teacher' ? (
                    <div
                        className={
                            styles.selectTeacher +
                            ' ' +
                            'ant-select-selection ant-select-selection--multiple'
                        }
                    >
                        <PlusOutlined
                            className={styles.clickPlus}
                            onClick={() => this.changeSelectTeacherModalVisible(true)}
                        />
                        <TreeSelect {...tProps} />
                        {selectTeacherModalVisible && (
                            <SearchTeacher
                                modalVisible={selectTeacherModalVisible}
                                cancel={this.changeSelectTeacherModalVisible}
                                language={'zh_CN'}
                                confirm={this.selectTeacherConfirm}
                                selectedList={this.handleData(teacherIds)} //选中人员，组件当中回显{[id: 1, name: '', englishName: '']},如果是组织id，id处理成"org-1"的形式
                                selectType="1" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                            />
                        )}
                    </div>
                ) : (
                    <div>
                        <Select
                            mode="multiple"
                            onChange={this.roleChange}
                            style={{ width: 300, marginLeft: 10 }}
                            placeholder="搜索或选择角色"
                            value={tagList}
                        >
                            {!lodash.isEmpty(roleTag) &&
                                roleTag.map((item) => (
                                    <Option value={item.roleTagCode} key={item.roleTagCode}>
                                        {item.roleTagName}
                                    </Option>
                                ))}
                        </Select>
                    </div>
                )}
            </div>
        );
    }
}
