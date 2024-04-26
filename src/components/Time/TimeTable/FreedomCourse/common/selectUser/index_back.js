//人员选择组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

const { SHOW_PARENT } = TreeSelect;

export default class SelectUser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
        };
    }

    componentWillMount() {
        const { freeCourseDetail, teacherType, selectTeacherType } = this.props;
        if (selectTeacherType == 'edit') {
            if (teacherType == 'necessary') {
                this.setState({
                    value: this.getIds(freeCourseDetail && freeCourseDetail.necessaryTeachers),
                });
            } else if (teacherType == 'unnecessary') {
                this.setState({
                    value: this.getIds(freeCourseDetail && freeCourseDetail.unnecessaryTeachers),
                });
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTeacherType == 'create') {
            //新增
            if (nextProps.showFreedomCourse != this.props.showFreedomCourse) {
                if (!nextProps.showFreedomCourse) {
                    this.setState({
                        value: [],
                    });
                }
            }
        }
        if (nextProps.selectTeacherType == 'edit') {
            //编辑
            if (nextProps.showEditFreedomCourse != this.props.showEditFreedomCourse) {
                if (!nextProps.showEditFreedomCourse) {
                    this.setState({
                        value: [],
                    });
                }
                if (nextProps.showEditFreedomCourse) {
                    if (nextProps.teacherType == 'necessary') {
                        this.setState({
                            value: this.getIds(
                                nextProps.freeCourseDetail &&
                                    nextProps.freeCourseDetail.necessaryTeachers
                            ),
                        });
                    } else if (nextProps.teacherType == 'unnecessary') {
                        this.setState({
                            value: this.getIds(
                                nextProps.freeCourseDetail &&
                                    nextProps.freeCourseDetail.unnecessaryTeachers
                            ),
                        });
                    }
                }
            }
        }
    }

    //获取id
    getIds = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultId = [];
        arr.map((item) => {
            resultId.push(item.id);
        });
        return resultId;
    };
    onChange = (value) => {
        this.setState({
            value: value,
        });
        this.props.onChange.call(this, value);
    };

    handleTreeData(arr) {
        if (!arr || arr.length < 0) return [];
        let treeData = [];
        arr.map((item, index) => {
            let obj = {
                key: item.teacherId,
                value: item.teacherId,
                title: item.name + ' ' + item.englishName,
            };
            treeData.push(obj);
        });
        return treeData;
    }

    render() {
        let { treeData } = this.props;
        let dataSource = this.handleTreeData(treeData);

        const tPropsUser = {
            treeData: dataSource,
            value: this.state.value,
            onChange: this.onChange,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            searchPlaceholder: this.props.placeholder,
            showCheckedStrategy: SHOW_PARENT,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
        };
        return (
            <div>
                <TreeSelect {...tPropsUser} />
            </div>
        );
    }
}
