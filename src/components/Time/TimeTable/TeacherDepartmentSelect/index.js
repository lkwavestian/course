//部门选择组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Tree, Icon, TreeSelect } from 'antd';
import { trans, locale } from '../../../../utils/i18n';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;

export default class DepartmentSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.teacherIds) {
            const teacherIds =
                nextProps &&
                nextProps.teacherIds &&
                nextProps.teacherIds.map((item) => {
                    item = 'user-' + item;
                    return item;
                });
            if (nextProps.referenceSource == 'rule') {
                this.setState({
                    value: teacherIds,
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

    //选中select值
    onChange = (value) => {
        console.log(value, '---vvvv----');
        this.setState({ value });
        this.props.onChange.call(this, value);
    };

    //处理树节点
    handleTree(arr, title) {
        const { referenceSource } = this.props;

        if (arr && arr.length < 0) return;

        // for(let i = 0;i< arr.length;i++) {
        //     arr[i]['title'] = arr[i]['label'];
        //     arr[i]['value'] = arr[i]['orgTreeId'] ? "org-" + arr[i]['orgTreeId'] : "user-" + arr[i]['key'];
        //     arr[i]['key'] = arr[i]['orgTreeId'] ? "org-" + arr[i]['orgTreeId'] : "user-" + arr[i]['key'];
        //     arr[i]['searchTitle'] = arr[i]['label'] + '-' + title;
        //     if (arr[i].children) {
        //       this.handleTree(arr[i].children , arr[i]['searchTitle']);
        //     }else{
        //       if (referenceSource != 'rule') {
        //         arr[i]['disabled'] = true;
        //       }
        //     }
        // }

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

    render() {
        let { treeData, teacherViewOrgDisabled, inputWidth, referenceSource } = this.props;
        let orgSource = this.handleTree(treeData, '');

        const tProps = {
            treeData: orgSource,
            value: this.state.value,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: referenceSource == 'rule' ? SHOW_CHILD : SHOW_PARENT,
            treeNodeFilterProp: 'searchTitle',
            searchPlaceholder: this.props.placeholder,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            style: { width: inputWidth },
            placeholder:
                referenceSource == 'rule'
                    ? '输入部门或教师关键字搜索'
                    : trans('global.searchDepartments', '按部门筛选'),
            disabled: teacherViewOrgDisabled,
            treeDefaultExpandedKeys: this.getDefaultExpandedKeys(),
        };
        return (
            <div>
                <TreeSelect {...tProps} />
            </div>
        );
    }
}
