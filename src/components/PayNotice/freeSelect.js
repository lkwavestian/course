//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Menu, Dropdown, Icon, Select, TreeSelect, Input, Checkbox, Tree } from 'antd';
import { trans } from '../../utils/i18n';

const { Option } = Select;
const { TreeNode, DirectoryTree } = Tree;

export default class FreeSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            indeterminate: true,
            checkAll: false,
            checkedStudentList: [],
            notActiveStudentList: [],
            mainList: [], // 获取全部List
            isAppend: false, // 筛选组件显隐
        };
    }

    // 选择年级：班级更新，学生更新
    // 选择班级：班级不更新，学生更新

    componentDidMount() {
        const { student, checkedStudentList } = this.props;

        // 监听body点击事件，点击非该组件元素，下拉关闭
        document.querySelector('body').addEventListener('click', (e) => {
            if (!this.state.isAppend) {
                return;
            }
            // 点击元素为该组件内的，不执行
            if (this.mainBox.contains(e.target)) {
                return;
            }
            this.handleAppend();
        });

        this.getData(student, checkedStudentList, true);
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.student,'nextProps.student')
        if (nextProps.isUpdateMain == 3) {
            const list = nextProps.student;
            this.getData(list, this.state.checkedStudentList, false);
        }
    }

    // 控制自定义组件显隐
    handleAppend = () => {
        const isAppend = this.state.isAppend;
        this.setState(
            {
                isAppend: !isAppend,
            },
            () => {
                if (!isAppend) {
                    this.props.studentBox.scrollIntoView();
                }
            }
        );
    };

    // 获取各个列表数据
    getData = (mainList, checkedList, isSetState) => {
        let list = [];
        if (mainList && mainList.length) {
            mainList.map((item) => {
                checkedList.length &&
                    checkedList.map((i) => {
                        if (item.userId == i) {
                            list.push(i);
                        }
                    });
            });
        }

        this.setState(
            {
                checkedStudentList: list,
                mainList,
            },
            () => {
                if (isSetState) {
                    this.props.exportUserList(this.state.checkedStudentList);
                }
            }
        );
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    // 对人员数据处理，获取全部id
    getOptionList = () => {
        const { student } = this.props;
        const optionList = [];
        student &&
            student.length &&
            student.map((item, index) => {
                optionList.push(item.userId);
            });
        return optionList;
    };

    // 选择全部的change事件
    onCheckAllChange = (e) => {
        const { notActiveStudentList } = this.state;
        this.setState(
            {
                checkedStudentList: e.target.checked
                    ? [...this.getOptionList(), ...notActiveStudentList]
                    : notActiveStudentList,
                indeterminate: false,
                checkAll: e.target.checked,
            },
            () => {
                this.props.exportUserList(this.state.checkedStudentList);
            }
        );
    };

    // 选择树节点change事件
    changeItemList = (checkedStudentList) => {
        const list = this.getOptionList();
        const { notActiveStudentList } = this.state;
        this.setState(
            {
                checkedStudentList: [...checkedStudentList, ...notActiveStudentList], // 切换班级后，将其他班级已选中项合并
                indeterminate:
                    !!checkedStudentList.length && checkedStudentList.length < list.length,
                checkAll: checkedStudentList.length === list.length,
            },
            () => {
                this.props.exportUserList(this.state.checkedStudentList);
            }
        );
    };

    // 关键字查询
    searchKeyChnage = (e) => {
        const value = e.target.value;
        if (this.searchFlag) {
            clearTimeout(this.searchFlag);
            this.searchFlag = false;
        }
        this.searchFlag = setTimeout(() => {
            this.props.getList(value, this.getListAjxCb);
        }, 800);
    };

    handleGradeChange = (e) => {
        this.props.getGradeList(e);
    };

    // 切换班级回调
    getListAjxCb = (student) => {
        let { checkedStudentList } = this.state,
            notActiveStudentList = [],
            len = student.studentList && student.studentList.length,
            sameNum = 0;
        // 当前已选中项与切换班级返回的所有学生对比
        checkedStudentList.map((item) => {
            for (let i = 0; i < len; i++) {
                if (item === student.studentList[i].userId) {
                    sameNum++;
                    return item;
                }
            }
            // 若不相等，说明不是当前选中班级中的学生，存入notActiveStudentList
            notActiveStudentList.push(item);
        });
        this.setState({
            notActiveStudentList,
            checkAll: len === sameNum, // 若sameNum与当前选中班级的学生length相等，则全选
        });
    };

    handleGroupSelect = (keys, event) => {
        this.props.getGroupValue(keys[0], this.getListAjxCb);
    };

    // 最终显示选择内容的select change事件
    handleChange = (checkedStudentList) => {
        this.setState(
            {
                checkedStudentList,
            },
            () => {
                this.props.exportUserList(this.state.checkedStudentList);
            }
        );
    };

    render() {
        const { isAppend, checkedStudentList, mainList } = this.state;
        const { grade, group, student } = this.props;
        return (
            <div className={styles.selectSearch} ref={(ref) => (this.mainBox = ref)}>
                {checkedStudentList && checkedStudentList.length > 0 && (
                    <span className={styles.allData}>
                        {trans('charge.changeStudent_num', '已选择 {$length} 个学生', {
                            length: checkedStudentList.length,
                        })}{' '}
                    </span>
                )}
                <div onClick={this.handleAppend}>
                    <Select
                        mode="multiple"
                        style={{ width: '84%' }}
                        placeholder={trans('charge.pleaseSelect', '请选择')}
                        open={false}
                        value={checkedStudentList}
                        onChange={this.handleChange}
                    >
                        {mainList &&
                            mainList.length &&
                            mainList.map((item, index) => {
                                return (
                                    <Option value={item.userId} key={item.userId}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                    </Select>
                </div>
                {isAppend ? (
                    <div className={styles.selectBox}>
                        <div className={styles.searchStudent}>
                            <Input
                                placeholder={trans('charge.searchStudent', '请搜索选择学生')}
                                style={{ width: '100%' }}
                                size="large"
                                onChange={this.searchKeyChnage}
                            />
                        </div>
                        <div className={styles.selectTree}>
                            <div className={styles.select}>
                                <Select
                                    defaultValue={'全部'}
                                    style={{ width: '100px', margin: '0 auto' }}
                                    onChange={this.handleGradeChange}
                                    defaultValue={null}
                                    getPopupContainer={(triggerNode) => this.mainBox}
                                >
                                    <Option value={null}>
                                        {trans('course.plan.allGrade', '全部年级')}
                                    </Option>
                                    {grade &&
                                        grade.length &&
                                        grade.map((item, index) => {
                                            return (
                                                <Option value={item.grade} key={item.grade}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>

                                {group && group.length ? (
                                    <DirectoryTree
                                        showIcon={false}
                                        size="large"
                                        multiple
                                        defaultExpandAll
                                        onSelect={this.handleGroupSelect}
                                        onExpand={this.onExpand}
                                        defaultValue={null}
                                        ref={(ref) => (this.treeNode = ref)}
                                    >
                                        <TreeNode
                                            title={trans('global.allClasses', '全部班级')}
                                            key={null}
                                        />
                                        {group &&
                                            group.length &&
                                            group.map((item, index) => {
                                                return (
                                                    <TreeNode
                                                        title={item.name}
                                                        key={JSON.stringify({
                                                            groupId: item.groupId,
                                                            grade: item.grade,
                                                        })}
                                                    />
                                                );
                                            })}
                                    </DirectoryTree>
                                ) : (
                                    <span></span>
                                )}
                            </div>
                            <div className={styles.checkbox}>
                                <Checkbox
                                    className={styles.checkAll}
                                    value={null}
                                    key={0}
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >
                                    {trans('global.all.students', '全部学生')}
                                </Checkbox>
                                <Checkbox.Group
                                    style={{ width: '370px' }}
                                    onChange={this.changeItemList}
                                    value={checkedStudentList}
                                    // options={this.getOptionList()}
                                >
                                    {student && student.length
                                        ? student.map((item, index) => {
                                              return (
                                                  <Checkbox value={item.userId} key={item.userId}>
                                                      <span className={styles.img}>
                                                          <img src={item.avatar} />
                                                      </span>{' '}
                                                      {item.name} {item.enName}
                                                  </Checkbox>
                                              );
                                          })
                                        : null}
                                </Checkbox.Group>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
