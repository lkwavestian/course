import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Radio, Steps, Divider, Checkbox } from 'antd';
import lodash from 'lodash';

@Form.create()
@connect((state) => ({
    allAdminPos: state.devision.allAdminPos,
}))
export default class ShowPos extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            newCol: [],
            filters: [],
            exportIdLists: undefined,
            loading: false,
            filterCombination: [],
            tableData: [],
            copyTableData: [], //备用
        };
    }

    componentDidMount() {
        this.getGrade(this.props.id);
    }

    getGrade = (id) => {
        const { dispatch } = this.props;
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'devision/getAdminPos',
            payload: {
                dividePlanId: id,
            },
        }).then(() => {
            const { allAdminPos } = this.props;
            let columns = allAdminPos.title;

            let filterCombination = [];
            allAdminPos &&
                allAdminPos.result &&
                allAdminPos.result.map((item, inex) => {
                    item.divideResultCourseCombinationVOList.map((item2, index2) => {
                        filterCombination.push(
                            item2.courseCombination
                            // text: item2.courseCombination,
                            // value: item2.courseCombination,
                        );
                    });
                });
            filterCombination = lodash.uniqWith(filterCombination, lodash.isEqual);
            filterCombination = filterCombination.sort(function (a, b) {
                return a.localeCompare(b, 'zh-Hans-CN', { sensitivity: 'accent' });
            });
            let newArr = [];
            filterCombination.map((item) => {
                newArr.push({
                    text: item,
                    value: item,
                });
            });

            let dataArr = [];
            let filters = [];
            const posLength =
                allAdminPos &&
                allAdminPos?.result &&
                allAdminPos?.result[0].divideResultCourseCombinationVOList.length;
            for (let j = 0; j < posLength; j++) {
                filters.push([]);
            }

            allAdminPos &&
                allAdminPos.result &&
                allAdminPos.result.map((item, index) => {
                    console.log('item', item);
                    const newLen = item.divideResultCourseCombinationVOList
                        ? item.divideResultCourseCombinationVOList.length
                        : 0;

                    /* for (let k = 0; k < newLen; k++) {
                        filters[k].push({
                            text: item.divideResultCourseCombinationVOList[k].courseClassName,
                            value: item.divideResultCourseCombinationVOList[k].courseClassName,
                        });
                    } */
                    item.divideResultCourseCombinationVOList.map((dataItem, index2) => {
                        const len = item.divideResultCourseCombinationVOList
                            ? item.divideResultCourseCombinationVOList.length
                            : '';
                        // dataItem.divideResultCourseClassVOList.map((item2, index2) => {
                        let posCount = {};
                        let posLength = dataItem.divideResultCourseClassVOList
                            ? allAdminPos.result[index].divideResultCourseCombinationVOList[index2]
                                  .divideResultCourseClassVOList.length
                            : '';

                        for (let i = 0; i < posLength; i++) {
                            // if (dataItem.divideResultCourseClassVOList[i].courseNO == i) {
                            posCount[
                                'courseNO' + dataItem.divideResultCourseClassVOList[i].courseNO
                            ] = `${
                                posCount[
                                    'courseNO' + dataItem.divideResultCourseClassVOList[i].courseNO
                                ]
                                    ? posCount[
                                          'courseNO' +
                                              dataItem.divideResultCourseClassVOList[i].courseNO
                                      ] + '，'
                                    : ''
                            }${dataItem.divideResultCourseClassVOList[i].courseClassName}(${
                                dataItem.divideResultCourseClassVOList[i].studentNumber
                            }人)`;

                            // }
                        }

                        dataArr = [
                            ...dataArr,
                            {
                                adminClassId: item.adminClassId,
                                adminClassName: item.adminClassName,
                                courseCombination: dataItem.courseCombination,
                                totalNumber: dataItem.totalNumber,
                                boyNumber: dataItem.boyNumber,
                                girlNumber: dataItem.girlNumber,
                                ...posCount,
                                span: index2 === 0 ? len : 0,
                            },
                        ];
                        // });
                        return dataArr;
                    });
                    return dataArr;
                });

            console.log('filters', filters);
            const tableData = dataArr.map((item, index) => {
                item.key = index;
                return item;
            });
            this.setState({
                filterCombination: newArr,
                columns,
                tableData,
                copyTableData: tableData,
            });
            //静态表头
            this.setState({
                loading: false,
            });
        });
    };

    reduceSpan = (value, record) => {
        let tableData = JSON.parse(JSON.stringify(this.state.tableData));
        let filterArr = tableData.filter((item) => item.adminClassId == record.adminClassId);
        let includeValue = filterArr.filter((item) => item.courseCombination == value);
        let spanCount = includeValue.length;
    };

    render() {
        const { columns, filterCombination, loading, tableData } = this.state;
        let newCol = [];
        let _this = this;
        columns &&
            columns.map((item, index) => {
                if (index == 0) {
                    newCol.push({
                        title: item.split('-')[0],
                        dataIndex: item.split('-')[1],
                        key: item.split('-')[1],
                        align: 'center',
                        render: (text, row, index) => {
                            return {
                                children: text,
                                props: {
                                    // rowSpan: row.span,
                                },
                            };
                        },
                    });
                } else if (index == 1) {
                    newCol.push({
                        title: item.split('-')[0],
                        dataIndex: item.split('-')[1],
                        key: item.split('-')[1],
                        align: 'center',
                        filters: filterCombination,
                        onFilter: (value, record) => {
                            let bool = record.courseCombination.includes(value);
                            _this.reduceSpan(value, record);
                            return bool;
                        },
                    });
                } else if (index == 2 || index == 3 || index == 4) {
                    newCol.push({
                        title: item.split('-')[0],
                        dataIndex: item.split('-')[1],
                        key: item.split('-')[1],
                        align: 'center',
                    });
                } else if (index == 5) {
                    let posNum = item.split('-')[0];
                    for (let i = 0; i < posNum; i++) {
                        newCol.push({
                            title: '课位' + (i + 1),
                            dataIndex: 'courseNO' + (i + 1),
                            key: 'courseNO' + (i + 1),
                            align: 'center',
                            /* filters: `${this.state}.filterCourse${i+1}`,
                            onFilter: (value, record) => `${record}.courseNO${i+1}.includes(${value})`, */
                        });
                    }
                }
            });
        newCol.push({
            title: '待排课位',
            dataIndex: 'courseNO0',
            key: 'courseNO0',
            align: 'center',
        });
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <div>
                <Table
                    columns={newCol}
                    dataSource={tableData}
                    rowSelection={rowSelection}
                    loading={loading}
                    pagination={false}
                    scroll={{ y: 580 }}
                />
            </div>
        );
    }
}
