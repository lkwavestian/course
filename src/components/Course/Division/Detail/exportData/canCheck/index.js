import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Input, Button, Icon, Checkbox } from 'antd';
import lodash from 'lodash';
@Form.create()
@connect((state) => ({
    importStudentColunteer: state.devision.importStudentColunteer,
    stuComView: state.devision.stuComView,
}))
export default class CanCheck extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // stuListFirstKeys: [],
            loading: false,
            stuFilters: [],
        };
    }

    componentDidMount() {
        this.props.getImportStudentColunteer(this.props.id);
        /* const { importStudentColunteer } = this.props;
        console.log('importStudentColunteer', importStudentColunteer);
        let stuFilters = [];
        importStudentColunteer?.result.map((item, index) => {
            stuFilters.push({
                value: item.studentName,
                text: item.studentName,
            });
        });
        stuFilters = lodash.uniqWith(stuFilters, lodash.isEqual);
        this.setState({
            stuFilters,
        }); */
    }

    onShowSizeChange = (current, pageSize) => {
        console.log('pagination', current, pageSize);
    };

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
            selectedRowKeys: [],
        });
    };

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '', selectedRowKeys: [] });
    };

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        this.searchInput = node;
                    }}
                    placeholder="按学生姓名搜索"
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    取消
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) =>
            this.state.searchedColumn === dataIndex ? (
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

    render() {
        const { stuList, loading, stuListFirst, columns } = this.state;
        const { importStudentColunteer } = this.props;
        let stuFilters = [];
        importStudentColunteer &&
            importStudentColunteer.result &&
            importStudentColunteer.result.map((item, index) => {
                stuFilters.push({
                    value: item.studentName,
                    text: item.studentName,
                });
            });
        stuFilters = lodash.uniqWith(stuFilters, lodash.isEqual);
        let titleList = [];
        let titleRowList =
            importStudentColunteer.title && Object.keys(importStudentColunteer.title);
        titleRowList &&
            titleRowList.map((item, index) => {
                if (item == 'sex') {
                    titleList.push({
                        title: '性别',
                        dataIndex: 'sex',
                        align: 'center',
                        render: (item, row, index) => {
                            return row.sex == 1 ? '男' : row.sex == 2 ? '女' : '';
                        },
                    });
                } else if (item == 'studentName') {
                    titleList.push({
                        title: '姓名',
                        dataIndex: 'studentName',
                        key: 'studentName',
                        align: 'center',
                        ...this.getColumnSearchProps(item),
                        filters: stuFilters,
                        onFilter: (value, record) => {
                            return record.studentName.includes(value);
                        },
                        render: (value, row, index) => {
                            return {
                                children: value,
                            };
                        },
                    });
                } else {
                    titleList.push({
                        title: importStudentColunteer.title[item],
                        dataIndex: item,
                        align: 'center',
                    });
                }
            });
        let dataResult =
            importStudentColunteer?.result &&
            JSON.parse(JSON.stringify(importStudentColunteer.result).replaceAll('null', ''));
        /* const columns = [
            {
                title: '姓名',
                dataIndex: 'stuName',
                align: 'center',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                align: 'center',
            },
            {
                title: '行政班',
                dataIndex: 'className',
                align: 'center',
            },
            {
                title: '学号',
                dataIndex: 'stuId',
                align: 'center',
                key: 'stuId',
            },
            {
                title: '组合',
                dataIndex: 'combination',
                align: 'center',
            },
            {
                title: '物理',
                dataIndex: 'physics',
                align: 'center',
            },
            {
                title: '化学',
                dataIndex: 'chemistry',
                align: 'center',
            },
            {
                title: '技术',
                dataIndex: 'technology',
                align: 'center',
            },
            {
                title: '政治',
                dataIndex: 'politics',
                align: 'center',
            },
        ]; */
        const rowSelection = {
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const pagination = {
            showSizeChanger: true,
            onChange: () => this.onShowSizeChange(),
            defaultCurrent: 1,
            total: 100,
        };
        return (
            <div>
                <Table
                    columns={titleList}
                    dataSource={dataResult}
                    rowSelection={rowSelection}
                    rowKey="stuId"
                    // pagination={pagination}
                    // loading={loading}
                />
            </div>
        );
    }
}
