//规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select, Popover, Icon, TreeSelect } from 'antd';

const { Option } = Select;

@connect((state) => ({
    customStudentList: state.timeTable.customStudentList,
}))
export default class CustomCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            customSelectValue: 3, // 自定义筛选场景value
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
            customVisible: false, // 自定义筛选框显示状态
            currentVersionId: '',
        };
    }

    componentDidMount() {
        // this.getGroupByTree()
        this.props.onRef(this);
    }

    //按照教师搜索课表
    changeTeacher = (value) => {
        this.setState({
            selectTeacher: value,
        });
    };

    //按照场地进行筛选
    changeAddress = (value) => {
        this.setState({
            selectAddress: value,
        });
    };

    //选择年级
    changeGrade = (value) => {
        this.setState({
            gradeValue: value,
        });
    };

    // 搜索班级
    changeGroup = (e) => {
        this.setState({
            groupValue: e,
        });
    };

    // 搜索学生
    changeStudent = (value) => {
        this.setState({
            selectStudentValue: value,
        });
    };

    // 关闭自定义筛选
    cancelCustom = () => {
        this.setState({
            customVisible: false,
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
            customSelectValue: 3,
        });
    };

    // 确认查询结果
    confirmCustom = () => {
        const {
            customSelectValue,
            selectTeacher,
            selectAddress,
            gradeValue,
            groupValue,
            selectStudentValue,
        } = this.state;
        if (customSelectValue === 0) {
            // 教师
            this.props.getCustomResult(selectTeacher, 'teacher');
        } else if (customSelectValue === 1) {
            // 场地
            this.props.getCustomResult(selectAddress, 'address');
        } else if (customSelectValue === 2) {
            // 年级 年级班级调用统一接口
            this.props.getCustomResult(gradeValue, 'grade');
        } else if (customSelectValue === 3) {
            // 班级
            this.props.getCustomResult(groupValue, 'group');
        } else if (customSelectValue === 4) {
            this.props.getCustomResult(selectStudentValue, 'student');
        }
        this.setState(
            {
                customVisible: false,
                selectTeacher: undefined, // 自定义教师筛选value
                selectAddress: undefined, // 自定义场地筛选value
                gradeValue: undefined, // 自定义场景年级筛选value
                groupValue: undefined, // 自定义班级筛选value
                selectStudentValue: undefined, // 自定义学生筛选value
            },
            () => {
                this.setState({
                    customSelectValue: 0,
                });
            }
        );
    };

    // 获取自定义筛选select value
    getCustomSelectValue = (value) => {
        this.setState({
            customSelectValue: value,
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
        });
    };

    handleCustomVisibleChange = (visible) => {
        this.setState({ customVisible: visible });
    };

    teacherHtml = () => {
        const { selectTeacher } = this.state;
        const { teacherList } = this.props;
        return (
            <Select
                value={selectTeacher}
                placeholder="搜索教师"
                className={styles.searchTeacher}
                onChange={this.changeTeacher}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {teacherList &&
                    teacherList.length > 0 &&
                    teacherList.map((item) => {
                        return (
                            <Option value={item.teacherId} key={item.teacherId}>
                                {item.name} {item.englishName}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    addressHtml = () => {
        const { areaList } = this.props;
        const { selectAddress } = this.state;
        return (
            <Select
                value={selectAddress}
                placeholder="搜索场地"
                className={styles.searchTeacher}
                onChange={this.changeAddress}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {areaList &&
                    areaList.length > 0 &&
                    areaList.map((item) => {
                        return (
                            <Option value={item.id} key={item.id} title={item.name}>
                                {item.name}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    gradeHtml = () => {
        const { gradeList } = this.props;
        const { gradeValue } = this.state;
        return (
            <Select
                value={gradeValue}
                placeholder="搜索年级"
                className={styles.searchTeacher}
                onChange={this.changeGrade}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {gradeList &&
                    gradeList.length > 0 &&
                    gradeList.map((item) => {
                        return (
                            <Option value={item.id} key={item.id} title={item.name}>
                                {item.name}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    groupHtml = () => {
        const { groupList, gradeByTypeArr } = this.props;
        const { groupValue } = this.state;
        const studentGroupProps = {
            treeData: gradeByTypeArr,
            placeholder: '选择学生组',
            onChange: this.changeGroup,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeDefaultExpandedKeys: ['1行政班'],
        };
        return <TreeSelect {...studentGroupProps} />;
    };

    studentHtml = () => {
        const { selectStudentValue } = this.state;
        const { customStudentList } = this.props;
        return (
            <Select
                value={selectStudentValue}
                placeholder="搜索学生"
                className={styles.searchTeacher}
                onChange={this.changeStudent}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {customStudentList &&
                    customStudentList.length > 0 &&
                    customStudentList.map((item) => {
                        return (
                            <Option value={item.id} key={item.id} title={item.name}>
                                {item.name}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    render() {
        const { customSelectValue, customVisible } = this.state;
        const popoverContent = (
            <div className={styles.searchContent}>
                <div className={styles.form}>
                    <Select
                        style={{ width: 70, border: 'none' }}
                        onChange={this.getCustomSelectValue}
                        defaultValue={3}
                        value={customSelectValue}
                    >
                        <Option value={3}>班级</Option>
                        <Option value={2}>年级</Option>
                        <Option value={0}>教师</Option>
                        <Option value={1}>场地</Option>
                        <Option value={4}>学生</Option>
                    </Select>
                    <div className={styles.search}>
                        {customSelectValue === 0
                            ? this.teacherHtml()
                            : customSelectValue === 1
                            ? this.addressHtml()
                            : customSelectValue === 2
                            ? this.gradeHtml()
                            : customSelectValue === 3
                            ? this.groupHtml()
                            : customSelectValue === 4
                            ? this.studentHtml()
                            : null}
                    </div>
                </div>
                <span className={styles.confirm} onClick={this.confirmCustom}>
                    确认
                </span>
                <span className={styles.cancel} onClick={this.cancelCustom}>
                    取消
                </span>
            </div>
        );
        return (
            <div className={styles.customCourse}>
                <div className={styles.customContent}>
                    <Popover
                        placement="right"
                        title={null}
                        content={popoverContent}
                        trigger="click"
                        visible={customVisible}
                        onVisibleChange={this.handleCustomVisibleChange}
                    >
                        <span className={styles.plus}>
                            <Icon type="plus" />
                        </span>
                    </Popover>
                </div>
            </div>
        );
    }
}
