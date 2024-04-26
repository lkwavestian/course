import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../../../../icon.less';
import { Table, Input, Button, Icon, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchTeacher } from '@yungu-fed/yungu-selector';
import { trans } from '../../../../../utils/i18n';
import { locale } from 'moment';

const { Option } = Select;
@connect((state) => ({
    roleUserInfo: state.teacher.roleUserInfo,
    roleTagInfo: state.teacher.roleTagInfo,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    roleSemester: state.teacher.roleSemester,
    roleTableLoading: state.teacher.roleTableLoading,
    // gradeList: state.time.gradeList,
    roleSchoolId: state.teacher.roleSchoolId,
}))
export default class RoleTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            searchText: '',
            searchedColumn: '',
            selectTeacherModalVisible: false,
            userList: [],
            editRowInfo: {},
            deleteIconVisibility: {},
            deleteRowVisibility: {},

            val: '',
        };
    }

    componentDidMount() {
        this.getOrgTeacherList();
    }

    // 选择教师组件接口
    getOrgTeacherList = () => {
        const { dispatch } = this.props;
        if (typeof courseIndex_listOrgTeacherModels !== 'undefined') {
            dispatch({
                type: 'global/getCourseIndexTeacherAndOrg',
                payload: courseIndex_listOrgTeacherModels,
            });
        } else {
            dispatch({
                type: 'global/fetchTeacherAndOrg',
                payload: {},
            });
        }
    };

    getRoleUsrInfo = async () => {
        const {
            dispatch,
            roleSemester,
            roleTagInfo: { tag },
            roleSchoolId,
        } = this.props;
        await dispatch({
            type: 'teacher/toggleRoleTableLoading',
            payload: true,
        });
        await dispatch({
            type: 'teacher/getRoleUserInfo',
            payload: {
                tag: tag,
                schoolYearId: roleSemester,
                schoolId: roleSchoolId,
            },
        });
        await dispatch({
            type: 'teacher/toggleRoleTableLoading',
            payload: false,
        });
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    onSearch = (val) => {
        console.log('search:', val);
        this.setState({ val });
    };

    getColumnSearchProps = (dataIndex, dataIndexCh) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索 ${dataIndexCh}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block', borderRadius: 0 }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8, height: 'auto', borderRadius: 0 }}
                >
                    搜索
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90, height: 'auto', borderRadius: 0 }}
                >
                    重置
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            console.log('value', value);
            console.log('record :>> ', record);
            if (!record[dataIndex]) {
                return false;
            }
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) =>
            this.state.searchedColumn === dataIndex && text ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    judgeColumns = () => {
        const {
            roleTagInfo: { tag, scope },
        } = this.props;
        const { deleteIconVisibility, deleteRowVisibility } = this.state;
        let gradeColumn = {
            title: '年级',
            dataIndex: 'gradeName',
            key: 'gradeName',
            // width: '40%',
            ...this.getColumnSearchProps('gradeName', '年级'),
        };
        let userListColumn = {
            title: '姓名',
            dataIndex: 'userList',
            key: 'userList',
            width: '60%',
            render: (text, record, rowIndex) => (
                <span>
                    {record.userList.map((item, userIndex) => (
                        <span
                            className={styles.userName}
                            onMouseEnter={() => this.changeEdit(rowIndex, userIndex)}
                        >
                            <span className={styles.userNameItem}>{item.name}</span>
                            {deleteIconVisibility[userIndex] && deleteRowVisibility[rowIndex] && (
                                <i
                                    className={icon.iconfont + ' ' + styles.deleteIcon}
                                    onClick={(e) => this.deleteUserItem(record, item)}
                                >
                                    &#xe6ca;
                                </i>
                            )}
                        </span>
                    ))}
                    <Icon
                        type="plus-circle"
                        className={styles.plusIcon}
                        onClick={(e) => this.handlePlus(selectTeacherModalVisible, record)}
                    />
                </span>
            ),
        };
        let aliasNameColumn = {
            title: '角色别名',
            dataIndex: 'aliasName',
            key: 'aliasName',
            width: '20%',
            ...this.getColumnSearchProps('aliasName', '角色别名'),
        };
        let groupColumn = {
            title: '班级',
            dataIndex: 'groupName',
            key: 'groupName',
            ...this.getColumnSearchProps('groupName', '班级'),
            // width: '20%',
        };
        let otherGroupColumn = {
            title: '行政班',
            dataIndex: 'groupName',
            key: 'groupName',
            // width: '20%',
            ...this.getColumnSearchProps('groupName', '行政班'),
        };
        let campusDepColumn = {
            title: '学部',
            dataIndex: 'campusDeptName',
            key: 'campusDeptName',
            // width: '30%',
            ...this.getColumnSearchProps('campusDeptName', '学部'),
        };
        let stageColumn = {
            title: '学段',
            dataIndex: 'stageName',
            key: 'stageName',
            // width: '20%',
            ...this.getColumnSearchProps('stageName', '学段'),
        };

        const { selectTeacherModalVisible } = this.state;
        const gradeColumns = [gradeColumn, userListColumn /*aliasNameColumn*/];
        const classColumns = [groupColumn, userListColumn /*aliasNameColumn*/];
        const stageColumns = [stageColumn, userListColumn /*aliasNameColumn*/];
        const otherDepartmentColumns = [campusDepColumn, userListColumn /*aliasNameColumn*/];
        const otherGradeColumns = [gradeColumn, userListColumn /*aliasNameColumn*/];
        const otherClassColumns = [otherGroupColumn, userListColumn /*aliasNameColumn*/];
        const otherSubjectColumns = [
            {
                title: '学科',
                dataIndex: 'subjectName',
                key: 'subjectName',
                width: '20%',
                ...this.getColumnSearchProps('subjectName', '学科'),
            },
            {
                title: '年级',
                dataIndex: 'gradeName',
                key: 'gradeName',
                width: '20%',
                ...this.getColumnSearchProps('gradeName', '年级'),
            },
            {
                title: '姓名',
                dataIndex: 'userList',
                key: 'userList',
                render: (text, record, rowIndex) => (
                    <span>
                        {record.userList.map((item, userIndex) => (
                            <span
                                className={styles.userName}
                                onMouseEnter={() => this.changeEdit(rowIndex, userIndex)}
                            >
                                <span className={styles.userNameItem}>{item.name}</span>
                                {deleteIconVisibility[userIndex] && deleteRowVisibility[rowIndex] && (
                                    <i
                                        className={icon.iconfont + ' ' + styles.deleteIcon}
                                        onClick={(e) => this.deleteUserItem(record, item)}
                                    >
                                        &#xe6ca;
                                    </i>
                                )}
                            </span>
                        ))}
                        <Icon
                            type="plus-circle"
                            className={styles.plusIcon}
                            onClick={(e) => this.handlePlus(selectTeacherModalVisible, record)}
                        />
                    </span>
                ),
                // width: '25%',
            },

            // {
            //     title: '角色别名',
            //     dataIndex: 'aliasName',
            //     key: 'aliasName',
            //     width: '25%',
            //     ...this.getColumnSearchProps('aliasName', '角色别名'),
            // },
        ];
        const otherStageColumns = [
            {
                title: '学科',
                dataIndex: 'subjectName',
                key: 'subjectName',
                width: '20%',
                ...this.getColumnSearchProps('subjectName', '学科'),
            },
            {
                title: '学段',
                dataIndex: 'stageName',
                key: 'stageName',
                width: '20%',
                ...this.getColumnSearchProps('stageName', '学段'),
            },
            {
                title: '姓名',
                dataIndex: 'userList',
                key: 'userList',
                render: (text, record, rowIndex) => (
                    <span>
                        {record.userList.map((item, userIndex) => (
                            <span
                                className={styles.userName}
                                onMouseEnter={() => this.changeEdit(rowIndex, userIndex)}
                            >
                                <span className={styles.userNameItem}>{item.name}</span>
                                {deleteIconVisibility[userIndex] && deleteRowVisibility[rowIndex] && (
                                    <i
                                        className={icon.iconfont + ' ' + styles.deleteIcon}
                                        onClick={(e) => this.deleteUserItem(record, item)}
                                    >
                                        &#xe6ca;
                                    </i>
                                )}
                            </span>
                        ))}
                        <Icon
                            type="plus-circle"
                            className={styles.plusIcon}
                            onClick={(e) => this.handlePlus(selectTeacherModalVisible, record)}
                        />
                    </span>
                ),
                // width: '25%',
            },
            // {
            //     title: '角色别名',
            //     dataIndex: 'aliasName',
            //     key: 'aliasName',
            //     width: '25%',
            //     ...this.getColumnSearchProps('aliasName', '角色别名'),
            // },
        ];
        if (tag === 'GRADE_PRINCIPAL') {
            return gradeColumns;
        } else if (tag === 'CHIEF_TUTOR') {
            return classColumns;
        } else if (scope === 1) {
            return otherDepartmentColumns;
        } else if (scope === 2) {
            return otherGradeColumns;
        } else if (scope === 3) {
            return otherClassColumns;
        } else if (scope === 4) {
            return otherSubjectColumns;
        } else if (scope === 5) {
            return otherStageColumns;
        } else if (scope === 6) {
            return stageColumns;
        } else {
            return null;
        }
    };

    deleteUserItem = (userInfo, deleteUserItem) => {
        this.setState(
            {
                editRowInfo: userInfo,
            },
            () => {
                let userList = userInfo.userList
                    .filter((item) => item.id !== deleteUserItem.id)
                    .map((item) => item.id);
                this.selectTeacherConfirm(userList, 'delete');
            }
        );
    };

    handlePlus = (visible, record) => {
        this.setState({
            userList: record.userList.map((item) => item.id),
            editRowInfo: record,
        });
        this.changeSelectTeacherModalVisible();
    };

    changeSelectTeacherModalVisible = () => {
        const { selectTeacherModalVisible } = this.state;
        this.setState({
            selectTeacherModalVisible: !selectTeacherModalVisible,
        });
    };

    selectTeacherConfirm = (ids, deleteStatus) => {
        const { roleSemester, roleSchoolId } = this.props;
        const {
            editRowInfo: {
                subjectId,
                gradeId,
                groupId,
                campusDeptId,
                aliasName,
                stageId: stageNumId,
            },
        } = this.state;
        const {
            roleTagInfo: { tag, scope },
            dispatch,
        } = this.props;
        let payload = {};
        if (tag === 'GRADE_PRINCIPAL') {
            payload = {
                gradeId,
            };
        } else if (tag === 'CHIEF_TUTOR') {
            payload = {
                groupId,
            };
        } else if (scope === 1) {
            payload = {
                campusDeptId,
            };
        } else if (scope === 2) {
            payload = {
                gradeId,
            };
        } else if (scope === 3) {
            payload = {
                groupId,
            };
        } else if (scope === 4) {
            payload = {
                subjectId,
                gradeId,
            };
        } else if (scope === 5) {
            payload = {
                subjectId,
                stageNumId,
            };
        } else if (scope === 6) {
            payload = {
                stageNumId,
            };
        }
        payload.tag = tag;
        payload.userIdList = ids;
        payload.aliasName = aliasName;
        payload.schoolYearId = roleSemester;
        payload.schoolId = roleSchoolId;
        !deleteStatus && this.changeSelectTeacherModalVisible();
        dispatch({
            type: 'teacher/toggleRoleTableLoading',
            payload: true,
        });
        dispatch({
            type: 'teacher/editRoleUserInfoList',
            payload,
        }).then(() => {
            this.getRoleUsrInfo();
        });
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

    changeEdit = (rowIndex, userIndex) => {
        let deleteIconVisibility = {};
        let deleteRowVisibility = {};
        deleteIconVisibility[userIndex] = true;
        deleteRowVisibility[rowIndex] = true;
        this.setState({
            deleteIconVisibility,
            deleteRowVisibility,
        });
    };

    render() {
        const { roleUserInfo, roleTagInfo, roleTableLoading } = this.props;
        const {
            selectedRowKeys,
            selectTeacherModalVisible,
            userList,
            deleteIconVisibility,
            deleteRowVisibility,
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className={styles.roleTable}>
                <Table
                    dataSource={roleUserInfo}
                    columns={this.judgeColumns()}
                    rowSelection={rowSelection}
                    pagination={{ hideOnSinglePage: true }}
                    loading={roleTableLoading}
                    onMouseLeave={() => {
                        console.log('onMouseLeave');
                        this.setState({
                            deleteIconVisibility: {},
                            deleteRowVisibility: {},
                        });
                    }}
                    scroll={{ y: 'calc(100vh - 330px)' }}
                ></Table>
                {selectTeacherModalVisible && (
                    <SearchTeacher
                        modalVisible={selectTeacherModalVisible}
                        cancel={this.changeSelectTeacherModalVisible}
                        language={'zh_CN'}
                        confirm={this.selectTeacherConfirm}
                        selectedList={this.handleData(userList)} //选中人员，组件当中回显{[id: 1, name: '', englishName: '']},如果是组织id，id处理成"org-1"的形式
                        selectType="1" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                    />
                )}
            </div>
        );
    }
}
