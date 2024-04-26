import React from 'react';
import {
    Icon,
    Input,
    Button,
    Modal,
    Checkbox,
    Select,
    Popover,
    Row,
    Col,
    Tree,
    message,
    Divider,
} from 'antd';
import { connect } from 'dva';
import reqwest from 'reqwest';
import styles from './index.less';
import { trans, locale } from '../../../utils/i18n';
// import { debounce } from '../../../utils/utils';
import lodash, { isEmpty, debounce } from 'lodash';
import icon from '../../../icon.less';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, generateItems } from '../../../utils/utils';

Draggable.isTreeNode = 1;

const { Search, TextArea } = Input;
const confirm = Modal.confirm;
const { Option } = Select;
const { TreeNode } = Tree;

@connect((state) => ({
    listSubjects: state.course.listSubjects,
    suitStageList: state.course.suitStageList,
    listTree: state.course.listTree,
}))
class AreaList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dealNode: 0, //处理节点 1选中父节点 2选中子节点
            nodeInfo: {}, // 节点信息
            showEdit: false, // 添加、编辑领域
            tempAreaName: '', //添加领域时的名称
            showDetail: false, //
            showChildEdit: false, //添加编辑子节点
            tempChildName: '', //添加子领域时的名称
            showChildDetail: false,
            subjectVal: [], // 可选学科value
            groupInfoList: [],

            addSubfieldVisible: false,
            addArea: false,
            addSedArea: false,

            parentNodeInfo: {}, //所选中节点父节点信息
            selectedKey: [], //左侧树选中的key
            subInfo: {}, //正在编辑的信息
            editType: 0, //编辑领域or子领域Content
            delNodeVisible: false, //删除节点visible
            expandedKeys: [], //展开的keys
            title: '', //编辑时头部展示领域名
            isFlag: false,
        };
    }

    onColumnDrop = (value) => {
        console.log(value, 'onColumnDrop--value----');
    };

    getCardPayload = () => {
        console.log(111);
    };

    renderChildrenNode = (obj) => {
        return (
            <div className={styles.content} id="contentArea">
                {obj && obj.length ? (
                    <Container
                        onDrop={(value) => this.onColumnDrop(value)}
                        dragHandleSelector=".column-drag-handle"
                        dropPlaceholder={{
                            animationDuration: 150,
                            showOnTop: true,
                            className: 'cards-drop-preview',
                        }}
                    >
                        {obj.map((item, index) => {
                            return (
                                <Draggable key={`groupInfo${index}`}>
                                    <div className={styles.groupInfo} id={`groupInfo${index}`}>
                                        <div className={styles.teamNameArea} key={index}>
                                            <div className={`card-column-header ${styles.title}`}>
                                                <i
                                                    className={icon.iconfont}
                                                    // onClick={() =>
                                                    //     changeFold(index, !item.ifFold)
                                                    // }
                                                >
                                                    &#xe659;
                                                </i>
                                                <span className={styles.teamName}>{item.name}</span>
                                            </div>
                                        </div>
                                        <div className={styles.studentArea}>
                                            {item.children.length ? (
                                                <Container
                                                    onDrop={(dropResult) =>
                                                        this.onDrop(dropResult, index)
                                                    }
                                                    {...item}
                                                    groupName="col"
                                                    getChildPayload={(i) =>
                                                        this.getCardPayload(index, i)
                                                    }
                                                    dropPlaceholder={{
                                                        animationDuration: 150,
                                                        showOnTop: true,
                                                        className: styles.cardGhost,
                                                    }}
                                                >
                                                    {item.children.map((el, eIndex) => {
                                                        return (
                                                            <Draggable key={item.id}>
                                                                <div
                                                                    className={styles.head}
                                                                    key={eIndex}
                                                                    id={`card${index}_${eIndex}`}
                                                                >
                                                                    <i className={icon.iconfont}>
                                                                        &#xe643;
                                                                    </i>
                                                                    <span
                                                                        className={styles.check}
                                                                    ></span>

                                                                    <span className={styles.name}>
                                                                        <span>{el.name}</span>
                                                                    </span>
                                                                </div>
                                                            </Draggable>
                                                        );
                                                    })}
                                                </Container>
                                            ) : null}
                                        </div>
                                    </div>
                                </Draggable>
                            );
                        })}
                    </Container>
                ) : null}
            </div>
        );
    };

    renderTreeNodes = (listTree) => {
        return listTree.map((obj) => {
            return (
                <p
                // onClick={() => this.selectNode(isParentNode)}
                >
                    {obj.name}
                    {obj.children && this.renderChildrenNode(obj.children)}
                </p>
            );
        });
    };

    selectNode = (nodeType) => {
        return console.log('nodeType: ', 111, nodeType);
    };

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        this.props.dispatch({
            type: 'course/listDomainSubjectTree',
            payload: {},
        });
    };

    onDragEnter = (info) => {
        console.log(info);
    };

    onDrop = (dropResult, index) => {
        console.log(dropResult, 'onDrop--dropResult--');
        console.log(index, 'onDrop--index---');
        let sourceKey = dropResult.removedIndex;
        let targetKey = dropResult.addedIndex;
        let itemToAdd = dropResult.payload; //拖拽的元素
        let list = JSON.parse(JSON.stringify(this.state.groupInfoList));
        if (sourceKey != null && targetKey != null) {
            let info = list[`${index}`] || {};
            let student = info.studentUserList;
            student.splice(targetKey, 0, ...student.splice(sourceKey, 1));
            list[`${index}`] = info;
        } else if (sourceKey != null || targetKey != null) {
            if (sourceKey != null) {
                //当前组去掉该元素
                let info = list[`${index}`] || {};
                let student = info.studentUserList;
                student.splice(sourceKey, 1);
                list[`${index}`] = info;
            } else {
                //在当前组插入该元素
                let info = list[`${index}`] || {};
                let student = info.studentUserList;
                student.splice(targetKey, 0, itemToAdd);
            }
        }
        this.setState({
            groupInfoList: list,
        });

        //先清除定时器，10秒后自动保存
        clearTimer();
        timer = setInterval(() => {
            this.updateBigGroupInfo(list, true, () => {
                clearTimer();
            });
        }, 10000);
    };

    updateBigGroupInfo = (list, noMessage, callBack) => {
        const {} = this.props;

        let payloadObj = {};
        // props.dispatch({
        //   type: 'newStudent/saveGroupTeam',
        //   payload: {
        //     ...payloadObj
        //   },
        //   onSuccess: (id) => {
        //     if (!noMessage) {
        //       message.success(trans('global.successToast', '成功'));
        //     }
        //     setGroupInfoList(list);
        //     callBack && callBack();
        //   }
        // })
    };

    onSelect = (selectedKeys, info) => {
        if (!isEmpty(selectedKeys)) {
            let len = selectedKeys[0].split('-');
            if (len.length == 2) {
                this.setState({
                    dealNode: 1,
                });
            } else if (len.length > 2) {
                this.setState({
                    dealNode: 2,
                });
            }
            this.setState({
                nodeInfo: info.selectedNodes[0].props.title,
            });
        } else {
            this.setState({
                dealNode: 0,
                nodeInfo: {},
            });
        }
    };

    changeAreaName = (e) => {
        this.setState({
            tempAreaName: e.target.value,
        });
    };

    changeChildName = (e) => {
        this.setState({
            tempChildName: e.target.value,
        });
    };

    cancelCreate = () => {
        this.setState({
            showEdit: false,
            addAreaVisible: false,
            tempAreaName: '',
        });
    };

    createArea = () => {
        const {
            subInfo: { stage },
            tempAreaName,
        } = this.state;

        const { dispatch } = this.props;
        dispatch({
            type: 'course/insertDomainSubject',
            payload: {
                name: tempAreaName,
                enName: '',
                stage,
            },
        }).then(() => {
            this.setState(
                {
                    addAreaVisible: false,
                    tempAreaName: '',
                },
                () => {
                    const that = this;
                    dispatch({
                        type: 'course/listDomainSubjectTree',
                        payload: {},
                    }).then(() => {
                        const { listTree } = that.props;
                        //新建后定位在新的上
                        let selectedKey = '';
                        let tempObj = {};
                        listTree.map((item) => {
                            //三层结构深层次查询
                            if (item.name == tempAreaName) {
                                selectedKey = `${item.type}-${item.id}`;
                                tempObj = item;
                            } else if (item.children) {
                                item.children.map((el) => {
                                    if (el.name == tempAreaName) {
                                        selectedKey = `${el.type}-${el.id}`;
                                        tempObj = el;
                                    }
                                });
                            }
                        });
                        console.log(tempObj, tempAreaName, selectedKey, 'tempObj');
                        that.setState({
                            selectedKey: [selectedKey],
                            subInfo: tempObj,
                            addSedArea: true,
                            addArea: false,
                            editType: 1,
                            expandedKeys: [...that.state.expandedKeys, ...that.state.selectedKey],
                            title: tempObj.name,
                        });
                    });
                }
            );
        });
    };

    cancelChildCreate = () => {
        this.setState({
            showChildEdit: false,
            addSubfieldVisible: false,
            tempChildName: '',
        });
    };

    createChildArea = () => {
        const {
            subInfo: { stage, id },
            subInfo,
            tempChildName,
        } = this.state;
        this.props.dispatch({
            type: 'course/insertDomainSubject',
            payload: {
                name: tempChildName,
                enName: '',
                stage,
                parentId: id,
            },
            onSuccess: () => {
                this.setState(
                    {
                        showChildEdit: false,
                        showChildDetail: true,
                        addSubfieldVisible: false,
                        tempChildName: '',
                        editType: 2,
                        addArea: false,
                        addSedArea: false,
                    },
                    () => {
                        const that = this;
                        that.props
                            .dispatch({
                                type: 'course/listDomainSubjectTree',
                                payload: {},
                            })
                            .then(() => {
                                let result = null; // 运行结果
                                function getTreeItem(data, tempChildName) {
                                    data.map((item) => {
                                        if (item.name == tempChildName) {
                                            result = item; // 结果赋值
                                        } else {
                                            if (item.children) {
                                                getTreeItem(item.children, tempChildName);
                                            }
                                        }
                                    });
                                }
                                getTreeItem(that.props.listTree, tempChildName);
                                console.log('result: ', result);

                                that.props.dispatch({
                                    type: 'course/getSubjectLists',
                                    payload: {
                                        pageNum: 1,
                                        pageSize: 100,
                                        keywords: '',
                                        suitStages: result?.stage,
                                    },
                                });

                                console.log(that.state.expandedKeys, 'alal');

                                that.setState({
                                    selectedKey: [`${result.type}-${result.id}`],
                                    // expandedKeys: [
                                    //     ...that.state.expandedKeys,
                                    //     `${result.type}-${result.id}`,
                                    // ],
                                    subInfo: result,
                                    addSedArea: false,
                                    addArea: true,
                                    title: result.name,
                                    subjectVal: result?.subjectIds || [],
                                });
                            });
                    }
                );
            },
        });
    };

    onLoadData = () => {
        let tempData = JSON.parse(JSON.stringify(stageList));
        tempData[1].children = [
            {
                id: '1-1',
                title: '一年级',
            },
        ];
        stageList = tempData;
    };

    changeInfo = (type, e) => {
        let tempObj = JSON.parse(JSON.stringify(this.state.subInfo));
        tempObj[type] = e.target.value;
        this.setState({
            subInfo: tempObj,
        });
    };

    submit = (type) => {
        const {
            subInfo: { id, name, enName, stage, parentId },
            subjectVal,
        } = this.state;
        const { dispatch } = this.props;

        let payload = {};
        if (type == 'main') {
            if (!name || !enName) {
                message.warn('中英文名必填！');
                return;
            }
            payload = {
                id,
                name,
                enName,
                stage,
            };
        } else {
            if (!name || !enName || !subjectVal) {
                message.warn('中文名、英文名和关联学科必填！');
                return;
            }
            payload = {
                id,
                name,
                enName,
                stage,
                parentId,
                subjectIds: subjectVal,
            };
        }
        dispatch({
            type: 'course/updateDomainSubject',
            payload,
        }).then(() => {
            this.setState(
                {
                    editType: 0,
                    // expandedKeys: [],
                    selectedKey: type == 'subfield' ? [] : this.state.selectedKey,
                    subInfo: {},
                },
                () => {
                    this.getList();
                }
            );
        });
    };

    showSelectVib = () => {
        this.setState({
            subVisible: true,
        });
    };

    closeSel = () => {
        this.setState({
            subVisible: false,
        });
    };

    seletedSub = () => {
        this.setState({
            subVisible: false,
        });
    };

    changeSubList = (checked) => {
        this.setState({
            subjectVal: checked,
        });
    };

    formatCourseChildren = (arr) => {
        if (!arr || arr.length < 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.englishName,
                value: item.id,
                key: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    formatCourseList = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        let newArr = [];
        courseList.map((item, index) => {
            newArr = newArr.concat(item.children);
        });
        courseData = this.formatCourseChildren(newArr);
        return courseData;
    };

    handleAreaPopVisible = (visible) => {
        this.setState({
            addAreaVisible: visible,
            showEdit: true,
        });
    };

    handleSubfieldPopVisible = (visible) => {
        this.setState({
            addSubfieldVisible: visible,
            showChildEdit: true,
        });
    };

    selectObj = (selectedKeys) => {
        if (isEmpty(selectedKeys)) {
            this.setState({
                selectedKey: selectedKeys,
                editType: 0,
            });
            return;
        }
        const { listTree } = this.props;
        let isParentNode = false;
        let isSonNode = false;
        let parentNodeInfo = {};
        let editType = 2;

        let result = null; // 运行结果
        /**
         *实现思路就是通过递归函数判断当前节点是否等于要找的节点id，如果不是再判断是否有children节点，再通过递
         *归的方式将children节点传值到函数里面去调用这样就可以通过递归的方式遍历所有树形结构数据找到对应的节点
         **/
        function getTreeItem(data, type, id) {
            data.map((item) => {
                if (item.id == id && item.type == type) {
                    result = item; // 结果赋值
                } else {
                    if (item.children) {
                        getTreeItem(item.children, type, id);
                    }
                }
            });
        }
        getTreeItem(listTree, selectedKeys[0].split('-')[0], selectedKeys[0].split('-')[1]);

        listTree.map((item) => {
            if (
                item.id == selectedKeys[0].split('-')[1] &&
                item.type == selectedKeys[0].split('-')[0]
            ) {
                isParentNode = true;
                parentNodeInfo = item;
                editType = 0;
                return;
            } else if (
                item.children &&
                lodash.find(item.children, (el) => {
                    return el.id == selectedKeys[0].split('-')[1];
                })
            ) {
                isSonNode = true;
                parentNodeInfo = item;
                editType = 1;
                return;
            }
        });

        //点击孙子节点获取学科列表
        if (result.level == 2) {
            this.props.dispatch({
                type: 'course/getSubjectLists',
                payload: {
                    pageNum: 1,
                    pageSize: 100,
                    keywords: '',
                    suitStages: result.stage,
                },
            });
        }

        this.setState({
            addArea: isParentNode,
            addSedArea: isSonNode,
            parentNodeInfo,
            selectedKey: selectedKeys,
            subInfo: result,
            title: result.name,
            editType,
            subjectVal: result?.subjectIds || [],
        });
    };

    renderContent = (list) => {
        return list.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={`${item.type}-${item.id}`}>
                        {this.renderContent(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={`${item.type}-${item.id}`}
                    type={item.type}
                    title={item.name}
                    {...item}
                />
            );
        });
    };

    checkDel = (isFlag) => {
        if (!isEmpty(this.state.subInfo.children)) {
            message.warn('该领域下有子领域，请删除子领域后再操作。');
            return;
        }

        this.setState({
            delNodeVisible: true,
            isFlag,
        });
    };

    delNode = () => {
        const {
            subInfo: { id, name, enName, stage, parentId },
            subjectVal,
            isFlag,
        } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'course/updateDomainSubject',
            payload: {
                id,
                name,
                enName,
                stage,
                parentId: isFlag ? parentId : undefined,
                subjectIds: subjectVal,
                deleted: true,
            },
        }).then(() => {
            this.setState(
                {
                    editType: 0,
                    selectedKey: [],
                    subInfo: {},
                    delNodeVisible: false,
                },
                () => {
                    this.getList();
                }
            );
        });
    };

    cancelDel = () => {
        this.setState({
            delNodeVisible: false,
        });
    };

    onExpand = (expandedKeys) => {
        console.log('expandedKeys: ', expandedKeys);
        //展开事件
        this.setState({
            expandedKeys,
        });
    };

    render() {
        const { listTree, listSubjects } = this.props;
        const {
            tempAreaName,
            tempChildName,
            subVisible,
            subjectVal,
            selectedKey,
            addArea,
            editType,
            addSedArea,
            subInfo,
            title,
            expandedKeys,
        } = this.state;
        console.log('expandedKeys: ', expandedKeys);

        let relatedSubjects = [];
        !isEmpty(listSubjects) &&
            listSubjects.map((item) => {
                !isEmpty(subjectVal) &&
                    subjectVal.map((el) => {
                        if (item.id == el) {
                            relatedSubjects.push(item);
                        }
                    });
            });

        const addUnitContent = (
            <div className={styles.addUnitModal}>
                <Input
                    placeholder="请在此处填写领域名称"
                    className={styles.inputStyle}
                    onChange={this.changeAreaName}
                    value={tempAreaName}
                />
                <div className={styles.buttonStyle}>
                    <span className={styles.cancelBtn} onClick={this.cancelCreate}>
                        取消
                    </span>
                    <span
                        className={styles.saveBtn}
                        style={{ backgroundColor: '#0445FC' }}
                        onClick={this.createArea}
                    >
                        确认
                    </span>
                </div>
            </div>
        );

        const addSubfieldContent = (
            <div className={styles.addUnitModal}>
                <Input
                    placeholder="请在此处填写子领域名称"
                    className={styles.inputStyle}
                    onChange={this.changeChildName}
                    value={tempChildName}
                />
                <div className={styles.buttonStyle}>
                    <span className={styles.cancelBtn} onClick={this.cancelChildCreate}>
                        取消
                    </span>
                    <span
                        className={styles.saveBtn}
                        style={{ backgroundColor: '#0445FC' }}
                        onClick={this.createChildArea}
                    >
                        确认
                    </span>
                </div>
            </div>
        );

        return (
            <div className={styles.main}>
                <div className={styles.leftCon}>
                    {/* <div>{this.renderTreeNodes(listTree)}</div> */}
                    <Tree
                        onSelect={this.selectObj}
                        selectedKeys={selectedKey}
                        autoExpandParent
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                    >
                        {this.renderContent(listTree)}
                    </Tree>
                    <div className={styles.createStyle}>
                        {addArea ? (
                            <Popover
                                content={addUnitContent}
                                title="添加领域"
                                trigger="click"
                                data-type="添加领域"
                                visible={this.state.addAreaVisible}
                                onVisibleChange={this.handleAreaPopVisible}
                            >
                                <span>{`+  添加领域`}</span>
                            </Popover>
                        ) : addSedArea ? (
                            <Popover
                                content={addSubfieldContent}
                                title="添加子领域"
                                trigger="click"
                                data-type="添加子领域"
                                visible={this.state.addSubfieldVisible}
                                onVisibleChange={this.handleSubfieldPopVisible}
                            >
                                <span>{`+  添加子领域`}</span>
                            </Popover>
                        ) : null}
                    </div>
                </div>
                <Modal
                    visible={subVisible}
                    title="关联学科"
                    onCancel={this.closeSel}
                    onOk={this.seletedSub}
                >
                    <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={this.changeSubList}
                        value={subjectVal}
                    >
                        <Row>
                            {!isEmpty(listSubjects) &&
                                listSubjects.map((item) => {
                                    return (
                                        <Col span={8}>
                                            <Checkbox value={item.id}>{item.name}</Checkbox>
                                        </Col>
                                    );
                                })}
                        </Row>
                    </Checkbox.Group>
                </Modal>
                <Modal
                    visible={this.state.delNodeVisible}
                    title="删除"
                    onOk={this.delNode}
                    onCancel={this.cancelDel}
                >
                    <p>{`您确定要删除“${subInfo.name}”吗？`}</p>
                </Modal>
                <div className={styles.rightCon}>
                    {editType == 1 ? (
                        <div className={styles.areaStyle}>
                            <div className={styles.titleStyle}>
                                <span>{title}</span>
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => this.checkDel(false)}
                                >
                                    删除
                                </span>
                            </div>
                            <Divider />
                            {/* <hr /> */}
                            <div className={styles.conStyle}>
                                <p className={styles.listStyle}>
                                    <span>中文标题</span>
                                    <span style={{ color: 'red' }}>*</span>
                                    <Input
                                        style={{ marginLeft: 20, width: '70%' }}
                                        onChange={(e) => this.changeInfo('name', e)}
                                        value={subInfo?.name || ''}
                                    />
                                </p>
                                <p className={styles.listStyle}>
                                    <span>英文标题</span>
                                    <span style={{ color: 'red' }}>*</span>
                                    <Input
                                        style={{ marginLeft: 20, width: '70%' }}
                                        onChange={(e) => this.changeInfo('enName', e)}
                                        value={subInfo?.enName || ''}
                                    />
                                </p>
                            </div>
                            <div className={styles.saveStyle}>
                                <Button type="primary" onClick={() => this.submit('main')}>
                                    保存
                                </Button>
                            </div>
                        </div>
                    ) : editType == 2 && subInfo.id ? (
                        <div className={styles.areaStyle}>
                            <div className={styles.titleStyle}>
                                <span>{title}</span>
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => this.checkDel(true)}
                                >
                                    删除
                                </span>
                            </div>
                            <Divider />
                            <div className={styles.conStyle}>
                                <p className={styles.listStyle}>
                                    <span>中文标题</span>
                                    <span style={{ color: 'red' }}>*</span>
                                    <Input
                                        style={{ marginLeft: 20, width: '70%' }}
                                        value={subInfo?.name || ''}
                                        onChange={(e) => this.changeInfo('name', e)}
                                    />
                                </p>
                                <p className={styles.listStyle}>
                                    <span>英文标题</span>
                                    <span style={{ color: 'red' }}>*</span>
                                    <Input
                                        style={{ marginLeft: 20, width: '70%' }}
                                        value={subInfo?.enName || ''}
                                        onChange={(e) => this.changeInfo('enName', e)}
                                    />
                                </p>
                                <p className={styles.listStyle}>
                                    <span style={{ verticalAlign: 'top' }}>关联学科</span>
                                    <span style={{ color: 'red', verticalAlign: 'top' }}>*</span>
                                    <div className={styles.selStyle}>
                                        {relatedSubjects.map((el) => {
                                            return (
                                                <span
                                                    style={{
                                                        margin: '5px 10px',
                                                        fontSize: '12px',
                                                        background: '#EAEBEF',
                                                        borderRadius: '5px',
                                                        padding: '3px',
                                                        whiteSpace: 'nowrap',
                                                        wordBreak: 'break-all',
                                                    }}
                                                    key={el.id}
                                                >
                                                    {el.name}
                                                    <Icon
                                                        type="close-circle"
                                                        style={{
                                                            marginLeft: 5,
                                                            color: 'white',
                                                            background: 'grey',
                                                            borderRadius: '7px',
                                                        }}
                                                    />
                                                </span>
                                            );
                                        })}
                                        <span
                                            style={{
                                                border: '1px dashed',
                                                borderRadius: '5px',
                                                padding: '3px',
                                                fontSize: '12px',
                                            }}
                                            onClick={this.showSelectVib}
                                        >
                                            + 添加学科
                                        </span>
                                    </div>
                                </p>
                            </div>
                            <div className={styles.saveStyle}>
                                <Button type="primary" onClick={() => this.submit('subfield')}>
                                    保存
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default AreaList;
