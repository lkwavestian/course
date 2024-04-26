import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Radio, Button, Modal, Icon, Input } from 'antd';
import lodash from 'lodash';
import Highlighter from 'react-highlight-words';

@Form.create()
@connect((state) => ({
    studentInfo: state.devision.studentInfo,
}))
export default class AllGrade extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            submitValue: '启动系统分班',
            value: 1,
            stuId: [],
            columns: [],
            dataArr: [],
            stuFilters: [],
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: [],
            titleGather: undefined,
            courseSites: undefined,
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.divideResultStudentView();
    }

    divideResultStudentView = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/divideResultStudentView',
            payload: {
                dividePlanId: this.props.id,
            },
        }).then(() => {
            const { studentInfo } = this.props;
            let stuFilters = [];
            let dataArr = [];
            let titleGather = {};
            let courseSites = {};
            studentInfo.titleModels &&
                studentInfo.titleModels.length > 2 &&
                studentInfo.titleModels[2].children.map((item2, index2) => {
                    titleGather[item2.field] = [];
                });
            studentInfo.titleModels &&
                studentInfo.titleModels.length > 1 &&
                studentInfo.titleModels[1].children.map((item2, index2) => {
                    courseSites[item2.field] = [];
                });

            studentInfo.contentModels.map((item, index) => {
                stuFilters.push({
                    value: item.studentName,
                    text: item.studentName,
                });
                Object.keys(titleGather).map((item3, index3) => {
                    item.chooseCourseMap &&
                        Object.keys(item.chooseCourseMap).map((item4, index4) => {
                            if (item3 == item4) {
                                titleGather[item3].push({
                                    value: item.chooseCourseMap[item4],
                                    text: item.chooseCourseMap[item4],
                                });
                            }
                        });
                });
                let newKeys = Object.keys(titleGather);
                let newValues = Object.values(titleGather);
                newKeys.map((item2, index2) => {
                    titleGather[item2] = lodash.uniqWith(newValues[index2], lodash.isEqual);
                });

                Object.keys(courseSites).map((item3, index3) => {
                    item.groupNumMap &&
                        Object.keys(item.groupNumMap).map((item4, index4) => {
                            if (item3 == item4) {
                                courseSites[item3].push({
                                    value: item.groupNumMap[item4],
                                    text: item.groupNumMap[item4],
                                });
                            }
                        });
                });
                let newKey = Object.keys(courseSites);
                let newValue = Object.values(courseSites);
                newKey.map((item2, index2) => {
                    courseSites[item2] = lodash.uniqWith(newValue[index2], lodash.isEqual);
                });
                dataArr = [
                    ...dataArr,
                    {
                        studentNum: item.studentNum,
                        studentName: item.studentName,
                        sex: item.sex,
                        courseCombination: item.courseCombination,
                        oldAdminGroup: item.oldAdminGroup ? item.oldAdminGroup : '',
                        newAdminGroup: item.newAdminGroup ? item.newAdminGroup : '',
                        //添加ID
                        stuId: item.stuId,
                        ...item.groupNumMap,
                        ...item.chooseCourseMap,
                    },
                ];
            });
            stuFilters = lodash.uniqWith(stuFilters, lodash.isEqual);
            this.setState({
                dataArr,
                stuFilters,
                titleGather,
                courseSites,
            });
        });
    };
    systemShift = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            submitValue: '系统分班中。。。',
            loading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                loading: false,
                submitValue: '启动系统分班',
            });
        }, 2000);
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onChangeType = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
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

    render() {
        let {
            loading,
            visible,
            value,
            submitValue,
            dataArr,
            stuFilters,
            selectedRowKeys,
            titleGather,
            courseSites,
        } = this.state;

        let { studentInfo } = this.props;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const onSelectChange = (selectedRowKeys) => {
            this.setState({
                stuId: selectedRowKeys,
                selectedRowKeys,
            });
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const pagination = {
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            onChange: () => this.setState({ selectedRowKeys: [], stuId: [] }),
            total: studentInfo.total || 500,
            pageSizeOptions: ['20', '50', '100', '500', '1000', '2000'],
        };
        let columns = [];
        studentInfo?.titleModels?.length > 0 &&
            studentInfo.titleModels.map((item, index) => {
                columns.push({
                    title: item.title,
                    children: item.children
                        ? item.children.map((item2, index2) => {
                              if (item2.field == 'studentName') {
                                  return {
                                      title: item2.title,
                                      dataIndex: item2.field,
                                      key: item2.field,
                                      align: 'center',
                                      ...this.getColumnSearchProps(item2.studentName),
                                      filters: stuFilters,
                                      onFilter: (value, record) => {
                                          return record.studentName.includes(value);
                                      },
                                      render: (value, row, index) => {
                                          return {
                                              children: value,
                                          };
                                      },
                                  };
                              } else if (
                                  titleGather != undefined &&
                                  Object.keys(titleGather).indexOf(item2.field) > -1
                              ) {
                                  return {
                                      title: item2.title,
                                      dataIndex: item2.field,
                                      key: item2.field,
                                      align: 'center',
                                      filters: titleGather[item2.field],
                                      onFilter: (value, record) => {
                                          if (
                                              titleGather != undefined &&
                                              Object.keys(titleGather).indexOf(item2.field) > -1
                                          ) {
                                              if (record[item2.field]) {
                                                  return record[item2.field].includes(value);
                                              }
                                          } else {
                                              return null;
                                          }
                                      },
                                      render: (value, row, index) => {
                                          return {
                                              children: value,
                                          };
                                      },
                                  };
                              } else if (
                                  courseSites != undefined &&
                                  Object.keys(courseSites).indexOf(item2.field) > -1
                              ) {
                                  return {
                                      title: item2.title,
                                      dataIndex: item2.field,
                                      key: item2.field,
                                      align: 'center',
                                      filters: courseSites[item2.field],
                                      onFilter: (value, record) => {
                                          if (
                                              courseSites != undefined &&
                                              Object.keys(courseSites).indexOf(item2.field) > -1
                                          ) {
                                              if (record[item2.field]) {
                                                  return record[item2.field].includes(value);
                                              }
                                          } else {
                                              return null;
                                          }
                                      },
                                      render: (value, row, index) => {
                                          return {
                                              children: value,
                                          };
                                      },
                                  };
                              } else {
                                  return {
                                      title: item2.title,
                                      dataIndex: item2.field,
                                      key: item2.field,
                                      align: 'center',
                                      /* filters: titleGather[item2.field],
                                    onFilter: (value, record) => {
                                        if (Object.keys(titleGather).indexOf(item2.field) > -1) {
                                            return record[item2.field].includes(value);
                                        } else {
                                            return null;
                                        }
                                    }, */
                                      render: (value, row, index) => {
                                          return {
                                              children: value,
                                          };
                                      },
                                  };
                              }
                          })
                        : '',
                });
                // }
            });
        return (
            <div>
                <Modal
                    title="系统分班"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={this.handleOk}
                        >
                            {submitValue}
                        </Button>,
                    ]}
                >
                    <p className={styles.selectHead}>
                        <span className={styles.left}>分班选项</span>
                        <Radio.Group onChange={this.onChangeType} value={value}>
                            <Radio style={radioStyle} value={1}>
                                清空当前分班结果重新进行分班
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                                保留当前分班结果，仅针对未分班学生进行分班
                            </Radio>
                        </Radio.Group>
                    </p>
                </Modal>

                <Table
                    columns={columns}
                    dataSource={dataArr}
                    rowKey="stuId"
                    rowSelection={rowSelection}
                    pagination={pagination}
                />
            </div>
        );
    }
}
