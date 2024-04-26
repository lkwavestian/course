//转移学生
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import LookStudentDetail from './lookStudentDetail';
import {
    Drawer,
    Form,
    Input,
    Button,
    Select,
    message,
    DatePicker,
    Table,
    Icon,
    Pagination,
    TreeSelect,
    Popover,
} from 'antd';
import { trans, locale } from '../../../../utils/i18n';
import icon from '../../../../icon.less';
const { Search } = Input;
@Form.create()
@connect((state) => ({
    recordList: state.student.recordList,
    // addStudentGradeList: state.student.addStudentGradeList, //行政班年级
    treeDataSource: state.student.treeDataSource, //行政班年级 2023 11.13替换
}))
class StudentInforRecord extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchRole: 'student',
            searchValue: undefined, //模糊搜索
            //searchTeacherValue: "", // 搜索导师的接口
            record: {},
            current: 1, //当前页数
            pageSize: 20,
            lookStudentVisible: false,
            loadPaginationBoolean: false,
            rowIds: [], //table选中的id,
            rowIdslist: {},
            ConfirmTransfer: undefined, //行政树
            changeSub: undefined, //提交状态
            searchStartTime: null, // 搜索开始时间
            searchEndTime: null, // 搜索结束时间
            changeWhether: undefined, //是否变更
            changeType: undefined, //变更类型
            onClickUrgedIf: false, //催一下禁用
            selectedRowKeys: [],
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.inforUpdateRecordVisible != this.props.inforUpdateRecordVisible) {
            if (nextProps.inforUpdateRecordVisible) {
                this.initRecord();
                this.getAdminClass();
            }
        }
    }

    hideModal = (type) => {
        if (type == 'lookStudentDetail') {
            this.setState({
                lookStudentVisible: false,
                record: {},
            });
        }
    };

    //查看学生详情
    lookStudentDetail = (record) => {
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    lookStudentVisible: true,
                });
            }
        );
    };

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.initRecord();
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
                this.initRecord();
            }
        );
    };
    //学生人员列表
    initRecord = () => {
        const { dispatch } = this.props;
        let {
            pageSize,
            current,
            searchValue,
            searchRole,
            ConfirmTransfer,
            changeSub,
            searchStartTime,
            searchEndTime,
            changeWhether,
            changeType,
        } = this.state;
        this.setState({
            loadPaginationBoolean: true,
        });
        dispatch({
            type: 'student/recordList',
            payload: {
                pageSize,
                pageNum: current,
                key: searchRole == 'student' ? searchValue : null,
                parentMobile: searchRole == 'student' ? null : searchValue,
                studentGroupId: ConfirmTransfer,
                status: changeSub,
                startTime: (searchStartTime && `${searchStartTime} 00:00:00`) || null,
                endTime: (searchEndTime && `${searchEndTime} 23:59:59`) || null,
                change: changeWhether,
                type: changeType,
            },
            onSuccess: () => {
                this.setState({
                    loadPaginationBoolean: false,
                });
            },
        });
    };

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'inforUpdateRecord');
        form.resetFields();
        this.setState({
            searchValue: undefined, //模糊搜索
            record: {},
            current: 1, //当前页数
            pageSize: 20,
            lookStudentVisible: false,
            loadPaginationBoolean: false,
            rowIds: [], //table选中的id,
            rowIdslist: {},
            ConfirmTransfer: undefined, //行政树
            changeSub: undefined, //提交状态
            searchStartTime: null, // 搜索开始时间
            searchEndTime: null, // 搜索结束时间
            changeWhether: undefined, //是否变更
            changeType: undefined, //变更类型
            onClickUrgedIf: false, //催一下禁用
            selectedRowKeys: [],
        });
    };

    //选择搜索条件的角色
    changeRole = (value) => {
        this.setState(
            {
                searchRole: value,
                searchValue: undefined,
            },
            () => {
                this.initRecord();
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
                this.initRecord();
            }
        );
    };

    //搜索条件中输入内容
    changeSearch = (e) => {
        this.setState({
            searchValue: e.target.value,
        });
    };

    //格式化树节点
    formatTreeData(data) {
        if (!data || data.length == 0) return [];
        let resultArr = [];
        data &&
            data.length > 0 &&
            data.map((item) => {
                let obj = {
                    title: item.name,
                    key: item.id,
                    value: item.studentGroupId,
                    children: this.formatTreeData(item.treeNodeList),
                };
                resultArr.push(obj);
            });
        return resultArr;
    }

    //行政班级
    getAdminClass() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getGradeList',
            payload: {},
            onSuccess: () => {},
        });
    }

    changeConfirmTransfer = (ConfirmTransfer) => {
        console.log(ConfirmTransfer, 'ConfirmTransfer');
        this.setState({ ConfirmTransfer }, () => {
            this.initRecord();
        });
    };

    changeSub = (value) => {
        this.setState(
            {
                changeSub: value,
            },
            () => {
                this.initRecord();
            }
        );
    };

    // 修改搜索时间
    changeSearchTime = (type, date, dateString) => {
        let { searchStartTime } = this.state;
        if (type === 1) {
            this.setState(
                {
                    searchStartTime: dateString,
                },
                () => {
                    this.initRecord();
                }
            );
        }
        if (type === 2) {
            // if (searchStartTime === null) {
            //     message.warn(trans('student.searchStartTime', '请先选择开始日期'));
            //     return;
            // }
            // let startTime = new Date(searchStartTime).getTime();
            // let endTime = new Date(dateString).getTime();
            // if (endTime <= startTime) {
            //     message.warn(trans('student.startTimeLessThanEndTime', '开始时间要小于结束时间'));
            //     return;
            // }
            this.setState(
                {
                    searchEndTime: dateString,
                },
                () => {
                    this.initRecord();
                }
            );
        }
    };

    changeWhether = (value) => {
        this.setState(
            {
                changeWhether: value,
            },
            () => {
                this.initRecord();
            }
        );
    };

    changeType = (value) => {
        this.setState(
            {
                changeType: value,
            },
            () => {
                this.initRecord();
            }
        );
    };

    //统计table选中的项
    fetchRowKeys = (keys, rowIds) => {
        this.setState({
            rowIds: rowIds,
        });
    };

    //催一下
    onClickUrged = () => {
        const { dispatch } = this.props;
        const { rowIdslist } = this.state;
        let list = [];
        for (var name in rowIdslist) {
            console.log(name + ':' + rowIdslist[name]);
            list.push(...rowIdslist[name]);
        }

        let recordIdList = [];
        this.setState({
            onClickUrgedIf: true,
            selectedRowKeys: [],
        });
        list.map((item) => {
            recordIdList.push(item.recordId);
        });
        if (list.length == 0) {
            message.info('请选择学生');
            this.setState({
                onClickUrgedIf: false,
            });
            return false;
        }
        setTimeout(() => {
            this.setState({
                onClickUrgedIf: false,
            });
        }, 3000);
        dispatch({
            type: 'student/onClickUrged',
            payload: {
                recordIdList,
            },
            onSuccess: () => {},
        });
    };

    render() {
        let {
            inforUpdateRecordVisible,
            resumptionRecordVisible,
            havePowerLookDetail,
            havePowerOperStudent,
            recordList,
            treeDataSource,
            classList,
        } = this.props;

        let { data, total } = recordList;
        let self = this;
        const {
            searchRole,
            searchValue,
            loadPaginationBoolean,
            current,
            rowIds,
            ConfirmTransfer,
            searchStartTime,
            searchEndTime,
            onClickUrgedIf,
        } = this.state;

        let columns = [
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render: function (text, record) {
                    let currentUrl = window.location.href;
                    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
                    let userId = record.userId;
                    let homePageUrl =
                        currentUrl.indexOf('yungu.org') > -1
                            ? 'https://profile.yungu.org/#/dynamic/' + userId
                            : 'https://student-profile.daily.yungu-inc.org/#/dynamic/' + userId;

                    return (
                        <a href={homePageUrl} target="_blank" className={styles.studentName}>
                            {text}
                        </a>
                    );
                },
            },
            {
                title: trans('student.englishName', '英文名'),
                dataIndex: 'enName',
                key: 'enName',
                align: 'center',
            },
            {
                title: trans('student.studentNo', '学号'),
                dataIndex: 'studentNo',
                key: 'studentNo',
                align: 'center',
            },
            {
                title: trans('student.sex', '性别'),
                dataIndex: locale() != 'en' ? 'gender' : 'gender',
                key: 'gender',
                align: 'center',
            },
            {
                title: trans('student.administrativeClassShow', '行政班'),
                dataIndex: locale() != 'en' ? 'studentGroupName' : 'studentGroupEnName',
                key: 'studentGroupName',
                align: 'center',
            },
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
                align: 'center',
                // render: function (text, record) {
                //     return (<span>{`${record.startTime}/${record.endTime}`}</span>)
                // }
            },
            {
                title: '提交状态',
                dataIndex: 'submitStatus',
                key: 'submitStatus',
                align: 'center',
                render: function (text, record) {
                    return <span>{`${record.submitStatus ? '已提交' : '待提交'}`}</span>;
                },
            },
            {
                title: '最近更新内容',
                dataIndex: 'changeInfo',
                key: 'changeInfo',
                align: 'center',
                ellipsis: true,
                render: (val, elt) => {
                    const value = val && val.split(';');
                    return (
                        <Popover
                            content={
                                <div style={{ maxWidth: '240px' }}>
                                    {value &&
                                        value.map((item, index) => {
                                            return <p>{item}</p>;
                                        })}
                                </div>
                            }
                            placement="bottom"
                        >
                            <div className={styles.whiteSpace}>{val || ''}</div>
                        </Popover>
                    );
                },
            },
            {
                title: '变更人',
                dataIndex: 'submitter',
                key: 'submitter',
                align: 'center',
            },
            {
                title: trans('student.opeation', '操作'),
                key: 'operation',
                align: 'center',
                render: function (text, record) {
                    return (
                        <span
                            className={styles.detailBtn}
                            onClick={() => self.lookStudentDetail(record)}
                        >
                            {trans('student.detail', '详情')}
                        </span>
                    );
                },
            },
        ];
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                const { current } = this.state;
                let rowIdslist = Object.assign({}, this.state.rowIdslist);
                rowIdslist[current] = selectedRows;
                this.setState(
                    {
                        rowIds: selectedRows,
                        rowIdslist: rowIdslist,
                        selectedRowKeys,
                    },
                    () => {
                        const { current, rowIdslist } = this.state;
                        console.log(rowIdslist, 'rowIdslist', current);
                    }
                );
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        let list = [];
        const { rowIdslist } = this.state;
        for (var name in rowIdslist) {
            console.log(name + ':' + rowIdslist[name]);
            list.push(...rowIdslist[name]);
        }
        let rowIdeList = [];
        list.map((item) => {
            rowIdeList.push(item.recordId);
        });
        const confirmExportUrl =
            window.location.origin +
            '/api/teaching/parentUpdateStudentInfo/exportRecordExcel?recordIds=' +
            rowIdeList.join(',');
        return (
            <div>
                <Drawer
                    visible={inforUpdateRecordVisible}
                    title={
                        <div style={{ textAlign: 'center' }}>
                            {trans('student.inforUploadRecord', '学生信息更新记录')}
                        </div>
                    }
                    width="100vw"
                    placement="right"
                    onClose={this.handleCancel}
                    className={styles.drawerStyle}
                >
                    <div style={{ minWidth: '1020px' }} className={styles.StudentInforRecord}>
                        <div style={{ display: 'flex' }}>
                            <span className={styles.searchItem}>
                                <Select
                                    onChange={this.changeRole}
                                    value={searchRole}
                                    className={styles.changeRoleStyle}
                                    style={{ width: 70 }}
                                >
                                    <Option key={0} value="student">
                                        {trans('student.student', '学生')}
                                    </Option>
                                    <Option key={1} value="parent">
                                        {trans('student.parent', '家长')}
                                    </Option>
                                </Select>
                                <Search
                                    value={searchValue}
                                    placeholder={
                                        searchRole == 'student'
                                            ? trans(
                                                  'student.searchStudentByPhone',
                                                  '请输入姓名/英文名/学号/手机号码搜索'
                                              )
                                            : trans(
                                                  'student.searchStudentByParent',
                                                  '请输入家长手机号码'
                                              )
                                    }
                                    onSearch={this.handleSearch}
                                    onChange={this.changeSearch}
                                    style={{ width: 350 }}
                                    className={styles.searchStyle}
                                />
                            </span>
                            <span
                                className={styles.searchItem}
                                style={{ display: 'flex', alignItems: 'center', marginLeft: 42 }}
                            >
                                <span className={styles.title}>行政班</span>
                                <Select
                                    style={{ width: 350, borderRadius: '8px' }}
                                    placeholder={'请选择行政班'}
                                    showSearch
                                    allowClear
                                    mode="multiple"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={this.changeConfirmTransfer}
                                    value={ConfirmTransfer}
                                >
                                    {classList.map((el) => {
                                        return (
                                            <Select.Option key={el.id} value={el.id}>
                                                {el.name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                                {/* <TreeSelect
                                    value={ConfirmTransfer}
                                    placeholder={'请选择行政班'}
                                    style={{ minWidth: 150 }}
                                    allowClear
                                    treeDefaultExpandAll
                                    multiple
                                    className={styles.searchSelectStyle}
                                    onChange={this.changeConfirmTransfer}
                                    treeData={this.formatTreeData(treeDataSource)}
                                ></TreeSelect> */}
                            </span>
                            <span className={styles.searchItem}>
                                <span className={styles.title}>提交状态</span>
                                <Select
                                    placeholder={'全部提交状态'}
                                    style={{ width: 150 }}
                                    className={styles.searchSelectStyle}
                                    onChange={this.changeSub}
                                >
                                    <Option value={null} key="0">
                                        {trans('student.searchAll', '全部')}
                                    </Option>
                                    <Option value={true} key="1">
                                        已提交
                                    </Option>
                                    <Option value={false} key="2">
                                        待提交
                                    </Option>
                                </Select>
                            </span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Fragment>
                                <span className={`${styles.searchItem} ${styles.searchItemOther}`}>
                                    <span className={styles.title}>
                                        {trans('student.start-end-time', '起止时间')}
                                    </span>
                                    <DatePicker
                                        className={styles.time}
                                        onChange={this.changeSearchTime.bind(this, 1)}
                                    />
                                    <span className={styles.line}>-</span>
                                    <DatePicker
                                        className={styles.time}
                                        onChange={this.changeSearchTime.bind(this, 2)}
                                    />
                                </span>
                            </Fragment>
                            <span className={styles.searchItem}>
                                <span className={styles.title}>信息变更与否</span>
                                <Select
                                    placeholder={'全部'}
                                    style={{ width: 150 }}
                                    className={styles.searchSelectStyle}
                                    onChange={this.changeWhether}
                                >
                                    <Option value={null} key="0">
                                        {trans('student.searchAll', '全部')}
                                    </Option>
                                    <Option value={true} key="1">
                                        是
                                    </Option>
                                    <Option value={false} key="2">
                                        否
                                    </Option>
                                </Select>
                            </span>
                            <span className={styles.searchItem}>
                                <span className={styles.title}>变更类型</span>
                                <Select
                                    placeholder={'请选择变更类型'}
                                    style={{ width: 150 }}
                                    className={styles.searchSelectStyle}
                                    onChange={this.changeType}
                                >
                                    <Option value={null} key="0">
                                        {trans('student.searchAll', '全部')}
                                    </Option>
                                    <Option value={1} key="1">
                                        邀请更新
                                    </Option>
                                    <Option value={2} key="2">
                                        主动更新
                                    </Option>
                                </Select>
                            </span>
                        </div>
                    </div>
                    <div className={styles.batchCondition}>
                        <div className={styles.left}>
                            {onClickUrgedIf ? (
                                <a
                                    style={{ borderColor: '#969fa9', color: '#969fa9' }}
                                    className={styles.batchButton}
                                >
                                    <i className={icon.iconfont}>&#xe62d;</i>催一下
                                </a>
                            ) : (
                                <a className={styles.batchButton} onClick={this.onClickUrged}>
                                    <i className={icon.iconfont}>&#xe62d;</i>催一下
                                </a>
                            )}
                            {/* {
                                havePowerTransfer && isShowAddStudent &&
                                <span className={styles.addPerson} onClick={this.addStudent}><i className={icon.iconfont}>&#xe75a;</i>{trans('student.addStudent', '添加学生')}</span>
                            } */}
                            <span className={styles.reloadBtn} onClick={this.initRecord}>
                                <i className={icon.iconfont}>&#xe732;</i>
                            </span>
                            {rowIds.length > 0 && (
                                <span className={styles.opText}>
                                    <Fragment>
                                        {trans('student.select.number', '已选择:{$num}名学生', {
                                            num: rowIds.length,
                                        })}
                                    </Fragment>
                                </span>
                            )}
                        </div>
                        <div className={styles.right}>
                            {rowIdeList.length !== 0 ? (
                                <a href={confirmExportUrl} className={styles.batchButton}>
                                    导出
                                </a>
                            ) : (
                                <a
                                    style={{
                                        background: '#f5f7f8',
                                        border: 'none',
                                        color: '#bfbfbf',
                                    }}
                                    className={styles.batchButton}
                                >
                                    导出
                                </a>
                            )}
                        </div>
                    </div>
                    <Table
                        loading={{
                            indicator: <Icon type="loading" />,
                            spinning: loadPaginationBoolean,
                            tip: 'loading...',
                        }}
                        style={{ margin: '0 44px' }}
                        rowSelection={rowSelection}
                        columns={columns}
                        rowKey={(record) => record.recordId}
                        dataSource={data || []}
                        pagination={false}
                        fetchRowKeys={this.fetchRowKeys}
                    />
                    <div className={styles.paginationStyle}>
                        <div className={styles.pageContainer}>
                            <Pagination
                                showSizeChanger
                                showQuickJumper
                                current={current}
                                total={total}
                                locale="zh-CN"
                                defaultPageSize={20}
                                pageSizeOptions={['20', '40', '100']}
                                onChange={this.switchPage}
                                onShowSizeChange={this.switchPageSize}
                            />
                        </div>
                    </div>
                </Drawer>
                <LookStudentDetail
                    havePowerLookDetail={havePowerLookDetail}
                    havePowerOperStudent={havePowerOperStudent}
                    {...this.state}
                    hideModal={this.hideModal}
                    pageSource="infoRecord"
                />
            </div>
        );
    }
}

export default StudentInforRecord;
