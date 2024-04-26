//添加学生公共组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Tree, Input, Checkbox, message, Menu } from 'antd';
import icon from '../../icon.less';
import MenuContext from 'antd/lib/menu/MenuContext';

const { TreeNode } = Tree;
const { Search } = Input;

let resultIds = [];

@connect((state) => ({
    addStudentGradeList: state.student.addStudentGradeList, //年级列表
    addStudentStudentList: state.student.addStudentStudentList, //非行政班添加学生的学生列表
    notAdminStudentList: state.student.notAdminStudentList, //行政班添加学生列表
}))
export default class FetchPersonByOrg extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            treeNodeId: [], //父级节点的id
            classifyNodeId: ['2'], //行政班分类的id
            keyWord: '', //搜索的关键字
            searchValue: '',
            addStudentStudentList: [], //学生列表
            saveSelectStudent: [], //保存选中的学生
            checkStudentValue: [], //选中学生的列表
            expandKeys: [], //展开的节点
            autoExpandParent: true,
        };
    }

    componentWillMount() {
        this.getGradeList();
    }

    //获取年级列表
    getGradeList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getGradeList',
            payload: {},
            onSuccess: () => {
                const { addStudentGradeList } = this.props;
                let selectId =
                    addStudentGradeList && addStudentGradeList[0] && `${addStudentGradeList[0].id}`;
                this.setState(
                    {
                        treeNodeId: [selectId],
                        expandKeys: this.getTreeNodeIds(addStudentGradeList),
                    },
                    () => {
                        this.getStudentList();
                    }
                );
            },
        });
    }

    //获取所有树节点id
    getTreeNodeIds(trees) {
        if (!trees || trees.length == 0) return;
        trees.map((item) => {
            if (item.treeNodeList) {
                resultIds = resultIds.concat(this.getTreeNodeIds(item.treeNodeList));
            }
            resultIds.push(`${item.id}`);
        });
        return Array.from(new Set(resultIds));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addStudentVisible != this.props.addStudentVisible) {
            if (!nextProps.addStudentVisible) {
                resultIds = [];
                //弹窗关闭
                this.setState({
                    treeNodeId: [],
                    classifyNodeId: ['2'],
                    keyWord: '',
                    searchValue: '',
                    addStudentStudentList: [],
                    saveSelectStudent: [],
                    checkStudentValue: [],
                    expandedKeys: [],
                    autoExpandParent: true,
                });
            } else {
                //弹窗打开
                this.getGradeList();
            }
        }
    }

    //渲染node
    renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.treeNodeList) {
                return (
                    <TreeNode title={item.name} key={item.id}>
                        {this.renderTreeNodes(item.treeNodeList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.name} {...item} />;
        });

    //输入关键字进行搜索学生
    handleSearch = (keyWord) => {
        this.setState(
            {
                keyWord,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //接收关键字
    changeSearch = (e) => {
        this.setState({
            searchValue: e.target.value,
        });
    };

    //选择学生
    changeStudent = (values) => {
        this.setState({
            checkStudentValue: values,
        });
        let saveSelectStudent = JSON.parse(JSON.stringify(this.state.saveSelectStudent));
        values &&
            values.length > 0 &&
            values.map((item) => {
                let id = item.split('&&')[0],
                    name = item.split('&&')[1];
                if (!this.isHaveId(id)) {
                    let obj = {
                        id: id,
                        name: name,
                    };
                    saveSelectStudent.push(obj);
                    this.setState(
                        {
                            saveSelectStudent: saveSelectStudent,
                        },
                        () => {
                            const { countStudentIds } = this.props;
                            typeof countStudentIds == 'function' &&
                                countStudentIds.call(this, this.state.saveSelectStudent);
                        }
                    );
                }
            });
    };

    //判断选中的学生是否在存储的数组中
    isHaveId(id) {
        const { saveSelectStudent } = this.state;
        let result = false;
        for (let i = 0; i < saveSelectStudent.length; i++) {
            if (saveSelectStudent[i].id && saveSelectStudent[i].id == id) {
                result = true;
                break;
            }
        }
        return result;
    }

    //选中年级或班级
    selectNode = (treeNodeId) => {
        this.setState(
            {
                treeNodeId,
                addStudentStudentList: [],
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //选中行政班的分类--待分班、已休学、已转学
    selectClassify = (e) => {
        this.setState(
            {
                classifyNodeId: [e.key],
                addStudentStudentList: [],
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //获取学生列表
    getStudentList = () => {
        const { dispatch, tagCode } = this.props;
        if (tagCode != 'ADMINISTRATIVE_CLASS') {
            //非行政班
            if (this.state.treeNodeId.length == 0) {
                message.info('请先选择一个年级或班级再进行查询');
                return false;
            }
            dispatch({
                type: 'student/addStudentList',
                payload: {
                    nodeId: this.state.treeNodeId[0] || '',
                    nameLike: this.state.keyWord,
                },
                onSuccess: () => {
                    const { addStudentStudentList } = this.props;
                    this.setState({
                        addStudentStudentList: addStudentStudentList,
                    });
                },
            });
        } else {
            if (this.state.classifyNodeId.length == 0) {
                message.info('请先选择一个类别再进行查询');
                return false;
            }
            dispatch({
                type: 'student/notAdminStudent',
                payload: {
                    status: this.state.classifyNodeId[0] || '',
                    nameLike: this.state.keyWord,
                },
                onSuccess: () => {
                    const { notAdminStudentList } = this.props;
                    this.setState({
                        addStudentStudentList: notAdminStudentList,
                    });
                },
            });
        }
    };

    //删除已经添加的学生
    deleteStudent(id) {
        let saveSelectStudent = JSON.parse(JSON.stringify(this.state.saveSelectStudent));
        saveSelectStudent &&
            saveSelectStudent.length > 0 &&
            saveSelectStudent.map((item, index) => {
                if (item.id == id) {
                    saveSelectStudent.splice(index, 1);
                }
            });
        this.setState(
            {
                saveSelectStudent: saveSelectStudent,
                checkStudentValue: [],
            },
            () => {
                const { countStudentIds } = this.props;
                typeof countStudentIds == 'function' &&
                    countStudentIds.call(this, this.state.saveSelectStudent);
            }
        );
    }

    //清空已经添加的学生
    clearAllStudent = () => {
        this.setState(
            {
                saveSelectStudent: [],
                checkStudentValue: [],
            },
            () => {
                const { countStudentIds } = this.props;
                typeof countStudentIds == 'function' &&
                    countStudentIds.call(this, this.state.saveSelectStudent);
            }
        );
    };

    onExpand = (expandKeys) => {
        this.setState({
            expandKeys,
            autoExpandParent: false,
        });
    };

    render() {
        const { addStudentGradeList, tagCode } = this.props;
        const {
            addStudentStudentList,
            saveSelectStudent,
            checkStudentValue,
            searchValue,
            treeNodeId,
            classifyNodeId,
            expandKeys,
            autoExpandParent,
        } = this.state;
        const checkboxStyle = {
            display: 'block',
            height: '35px',
            lineHeight: '35px',
            marginLeft: '5px',
        };
        return (
            <div className={styles.fetchPersonByOrgStyle}>
                <div className={styles.selectPerson}>
                    <p className={styles.selectPersonNum}>
                        已选中：<em>{saveSelectStudent.length}</em>个学生
                    </p>
                    {saveSelectStudent && saveSelectStudent.length > 0 && (
                        <div>
                            {saveSelectStudent.map((item) => {
                                return (
                                    <span key={item.id}>
                                        {item.name}
                                        <i
                                            className={icon.iconfont}
                                            onClick={this.deleteStudent.bind(this, item.id)}
                                        >
                                            &#xe6a9;
                                        </i>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className={styles.allStudentNum}>
                    <span className={styles.littleTips}>
                        <i className={icon.iconfont}>&#xe727;</i>{' '}
                        想找学生？筛选条件或输入条件搜一下试试~
                    </span>
                    <span className={styles.clearBtn}>
                        <em onClick={this.clearAllStudent}>清空</em>
                    </span>
                </div>
                <div className={styles.searchCondition}>
                    <div
                        className={styles.leftContainer}
                        style={{ padding: tagCode != 'ADMINISTRATIVE_CLASS' ? '15px' : '15px 0' }}
                    >
                        {tagCode != 'ADMINISTRATIVE_CLASS' ? (
                            <Tree
                                onSelect={this.selectNode}
                                onExpand={this.onExpand}
                                expandedKeys={expandKeys}
                                selectedKeys={treeNodeId}
                                autoExpandParent={autoExpandParent}
                            >
                                {this.renderTreeNodes(addStudentGradeList)}
                            </Tree>
                        ) : (
                            <Menu
                                onClick={this.selectClassify}
                                mode="inline"
                                selectedKeys={classifyNodeId}
                            >
                                {/* <Menu.Item key="1">在读</Menu.Item> */}
                                <Menu.Item key="2">待入学</Menu.Item>
                                {/* <Menu.Item key="3">已休学</Menu.Item>
                            <Menu.Item key="4">已转学</Menu.Item> */}
                            </Menu>
                        )}
                    </div>
                    <div className={styles.rightContainer}>
                        <Search
                            placeholder="输入关键字搜索学生"
                            className={styles.inputStyle}
                            onSearch={this.handleSearch}
                            onChange={this.changeSearch}
                            value={searchValue}
                        />
                        {addStudentStudentList && addStudentStudentList.length > 0 && (
                            <Checkbox.Group
                                onChange={this.changeStudent}
                                value={checkStudentValue}
                                className={styles.checkboxGroup}
                            >
                                {addStudentStudentList.map((item) => {
                                    return (
                                        <Checkbox
                                            key={item.userId}
                                            value={`${item.userId}&&${item.name}-${item.ename}`}
                                            style={checkboxStyle}
                                        >
                                            {item.name} {item.ename}
                                        </Checkbox>
                                    );
                                })}
                            </Checkbox.Group>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
