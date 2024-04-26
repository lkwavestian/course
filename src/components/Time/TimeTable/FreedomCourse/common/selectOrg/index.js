//部门选择组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Tree, Icon, TreeSelect } from 'antd';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default class SelectOrg extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
        };
    }

    componentWillMount() {
        const { freeCourseDetail, departmentType, selectOrgType } = this.props;
        if (selectOrgType == 'edit') {
            if (departmentType == 'necessary') {
                this.setState({
                    value: this.getIds(freeCourseDetail && freeCourseDetail.necessaryDepartments),
                });
            } else if (departmentType == 'unnecessary') {
                this.setState({
                    value: this.getIds(freeCourseDetail && freeCourseDetail.unnecessaryDepartments),
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectOrgType == 'create') {
            //新增
            if (nextProps.showFreedomCourse != this.props.showFreedomCourse) {
                this.setState({
                    value: [],
                });
            }
        }
        if (nextProps.selectOrgType == 'edit') {
            //编辑
            if (nextProps.showEditFreedomCourse != this.props.showEditFreedomCourse) {
                if (!nextProps.showEditFreedomCourse) {
                    this.setState({
                        value: [],
                    });
                }
                if (nextProps.showEditFreedomCourse) {
                    if (nextProps.departmentType == 'necessary') {
                        this.setState({
                            value: this.getIds(
                                nextProps.freeCourseDetail &&
                                    nextProps.freeCourseDetail.necessaryDepartments
                            ),
                        });
                    } else if (nextProps.departmentType == 'unnecessary') {
                        this.setState({
                            value: this.getIds(
                                nextProps.freeCourseDetail &&
                                    nextProps.freeCourseDetail.unnecessaryDepartments
                            ),
                        });
                    }
                }
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
        this.setState({ value });

        this.props.onChange.call(this, value);
    };

    //处理树节点
    handleTree(arr) {
        if (arr.length < 0) return;
        for (var i = 0; i < arr.length; i++) {
            arr[i]['title'] = arr[i]['label'];
            arr[i]['value'] = arr[i]['orgTreeId']
                ? 'org-' + arr[i]['orgTreeId']
                : 'user-' + arr[i]['key'];
            arr[i]['key'] = arr[i]['orgTreeId']
                ? 'org-' + arr[i]['orgTreeId']
                : 'user-' + arr[i]['key'];
            if (arr[i].children) {
                this.handleTree(arr[i].children);
            } else {
                arr[i]['disabled'] = true;
            }
        }
        return arr;
    }

    render() {
        let { treeData } = this.props;
        let orgSource = this.handleTree(treeData);

        const tProps = {
            treeData: orgSource,
            value: this.state.value,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            treeNodeFilterProp: 'title',
            searchPlaceholder: this.props.placeholder,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
        };
        return (
            <div>
                <TreeSelect {...tProps} />
            </div>
        );
    }
}
