import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Icon, Modal, Input, Button, Select, message } from 'antd';
import devision from '../../../../../../models/devision';
import lodash from 'lodash';

@Form.create()
@connect((state) => ({
    divideResultCombinationView: state.devision.divideResultCombinationView,
    combinationDetail: state.devision.combinationDetail,
}))
export default class AllGrade extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            filterCombination: [],
            visible: false,
            devideInfo: '',
            count: 0,
            titleModelsArr: '',
            groupModels: [],
            newCombinationDetailList: [],
            oldLen: 0,
            copyGroupModels: [],
            lotsFilter: [],
        };
    }

    componentDidMount() {
        this.divideResultCombinationView();
    }

    divideResultCombinationView = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/divideResultCombinationView',
            payload: {
                dividePlanId: this.props.id,
            },
        }).then(() => {
            const { divideResultCombinationView } = this.props;
            let tableData = [];
            let filterCombination = [];
            let lotsFilter = [];
            let count =
                (divideResultCombinationView &&
                    divideResultCombinationView?.titleModels &&
                    divideResultCombinationView.titleModels.length - 6) ||
                0;
            for (let i = 0; i < count; i++) {
                lotsFilter.push([]);
            }
            divideResultCombinationView?.contentModels &&
                divideResultCombinationView.contentModels.map((item, index) => {
                    const len = item.combinationDetailMapList
                        ? item.combinationDetailMapList.length
                        : '';
                    filterCombination.push({
                        text: item.combination,
                        value: item.combination,
                    });
                    item.combinationDetailMapList.map((item2, index2) => {
                        tableData.push({
                            combination: item.combination,
                            total: item.total,
                            boyTotal: item.boyTotal,
                            girlTotal: item.girlTotal,
                            ...item2,
                            span: index2 === 0 ? len : 0,
                        });

                        let newItem = Object.keys(item2);
                        newItem.length > 0 &&
                            newItem.map((item3, index3) => {
                                if (
                                    item3.includes('id') ||
                                    item3.includes('planTotal') ||
                                    item3.includes('sexRatio')
                                ) {
                                    delete item2[item3];
                                }
                            });

                        let newArr = [];
                        for (let j = 0; j < count; j++) {
                            newArr.push(Object.keys(item2)[j]);
                        }

                        let newItem2 = Object.keys(item2).sort();
                        let firstArr = [];
                        newItem2.map((item3, index3) => {
                            firstArr[item3] = item2[item3];
                        });

                        for (let k = 0; k < newArr.length; k++) {
                            lotsFilter[k].push({
                                text: firstArr[newItem2[k]],
                                value: firstArr[newItem2[k]],
                            });
                        }
                    });
                });
            filterCombination = lodash.uniqWith(filterCombination, lodash.isEqual);
            for (let i = 0; i < lotsFilter.length; i++) {
                lotsFilter[i] = lodash.uniqWith(lotsFilter[i], lodash.isEqual);
            }
            // lotsFilter = lodash.uniqWith(lotsFilter, lodash.isEqual);
            let start = lotsFilter.slice(lotsFilter.length - 1);
            lotsFilter.pop();
            let newFilters = [...start, ...lotsFilter];
            this.setState({
                tableData,
                filterCombination,
                lotsFilter: newFilters,
            });
        });
    };

    devideRow = (index) => {
        let { groupModels } = this.state;
        console.log('index', index);
        console.log('groupModels', groupModels);
        this.setState({
            groupModels: [...groupModels, groupModels[index]],
        });
    };

    changeTotal = (e, index) => {
        let groupModels = JSON.parse(JSON.stringify(this.state.groupModels));
        groupModels[index].total = e.target.value;
        this.setState({
            groupModels,
        });
    };

    changeSub = (num, value, item, index) => {
        let groupModels = JSON.parse(JSON.stringify(this.state.groupModels));
        groupModels[index].courseChooseDetailModelList[num].groupId = value;
        this.setState({
            groupModels,
        });
    };

    editPos = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/showCombinationDetail',
            payload: {
                dividePlanId: this.props.id,
                combination: e.combination,
            },
        }).then(() => {
            const { combinationDetail, divideResultCombinationView } = this.props;
            let newObj = [];
            divideResultCombinationView.contentModels.map((item, index) => {
                if (item.combination === e.combination) {
                    newObj = divideResultCombinationView.contentModels[index];
                } else {
                    return false;
                }
            });

            let oldLen = combinationDetail.classModels.length;
            let titleModelsArr = [
                <tr>
                    <th>人数</th>
                    {combinationDetail?.detailModels.map((item, index) => {
                        return <th>{combinationDetail.detailModels[index].courseName}</th>;
                    })}
                    {/* <th>{combinationDetail.detailModels[0].courseName}</th>
                    <th>{combinationDetail.detailModels[1].courseName}</th>
                    <th>{combinationDetail.detailModels[2].courseName}</th>
                    <th>{combinationDetail.detailModels[3].courseName}</th> */}
                </tr>,
            ];

            let newCombinationDetailList = [];
            combinationDetail.detailModels.map((item, index) => {
                newCombinationDetailList.push(
                    item.classModels && item.classModels.length > 0 ? [...item.classModels] : []
                );
            });
            newCombinationDetailList = newCombinationDetailList.map((item, index) => {
                return [{ id: null, name: '待分班' }, ...item];
            });

            let newArr = [];
            combinationDetail.detailModels.map((item, index) => {
                newArr.push(item.courseName);
            });

            let groupModels = [];
            console.log('combinationDetail.detailModels', combinationDetail.detailModels);
            combinationDetail.classModels.map((item, index) => {
                groupModels.push({
                    total: newObj.combinationDetailMapList[index]
                        ? newObj.combinationDetailMapList[index]?.planTotal
                        : 0,
                    /* courseChooseDetailModelList: combinationDetail.detailModels.map(
                        (item2, index2) => {
                            console.log('item2.courseName', item2.courseName);
                            return {
                                courseName: item2.courseName,
                                groupId: null,
                            };
                        }
                    ), */
                    /* [
                        { courseName: combinationDetail.detailModels[0].courseName, groupId: null },
                        { courseName: combinationDetail.detailModels[1].courseName, groupId: null },
                        { courseName: combinationDetail.detailModels[2].courseName, groupId: null },
                        { courseName: combinationDetail.detailModels[3].courseName, groupId: null },
                    ], */
                });
                groupModels[index].courseChooseDetailModelList = [];
                combinationDetail.detailModels.map((item2, index2) => {
                    groupModels[index].courseChooseDetailModelList.push({
                        courseName: item2.courseName,
                        groupId: null,
                    });
                });
            });

            console.log('groupModels', groupModels);

            combinationDetail.classModels.map((item, index) => {
                return item.map((item2, index2) => {
                    return groupModels[index].courseChooseDetailModelList.map((item3, index3) => {
                        if (item3.courseName == item2.name) {
                            return (groupModels[index].courseChooseDetailModelList[index3].groupId =
                                item2.id);
                        }
                    });
                });
            });

            let copyGroupModels = groupModels;

            /* groupModels.forEach((item, index) => {
                let arr = [];
                item.courseChooseDetailModelList.forEach((item2, index2) => {
                    if (item2.courseName == newArr[0]) {
                        arr[0] = item2;
                    } else if (item2.courseName == newArr[1]) {
                        arr[1] = item2;
                    } else if (item2.courseName == newArr[2]) {
                        arr[2] = item2;
                    } else if (item2.courseName == newArr[3]) {
                        arr[3] = item2;
                    }
                });
                return (groupModels[index].courseChooseDetailModelList = arr);
            }); */

            this.setState({
                visible: true,
                devideInfo: e,
                titleModelsArr,
                groupModels,
                newCombinationDetailList,
                oldLen,
                copyGroupModels,
            });
        });
    };

    handleOk = (e) => {
        const { dispatch } = this.props;
        const { devideInfo, groupModels, oldLen, copyGroupModels } = this.state;
        let num = 0;
        groupModels.map((item, index) => {
            num += Number(item.total);
        });

        for (let i = oldLen; i < groupModels.length; i++) {
            if (groupModels[i].total == 0) {
                groupModels.splice(i, 1);
            }
        }

        for (let i = 0; i < oldLen; i++) {
            if (groupModels[i].total == 0) {
                groupModels[i].courseChooseDetailModelList =
                    copyGroupModels[i].courseChooseDetailModelList;
            }
        }

        if (num === devideInfo.total) {
            dispatch({
                type: 'devision/updateCombination',
                payload: {
                    dividePlanId: this.props.id,
                    combination: devideInfo.combination,
                    groupModels: groupModels,
                },
            }).then(() => {
                this.setState({
                    visible: false,
                });
                this.divideResultCombinationView();
                message.success('调整成功！');
            });
        } else {
            message.warning('请核对分班人数之和!');
        }
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const {
            tableData,
            filterCombination,
            devideInfo,
            titleModelsArr,
            groupModels,
            newCombinationDetailList,
            lotsFilter,
        } = this.state;
        const { divideResultCombinationView, combinationDetail } = this.props;
        let newColumns = [];
        const renderContent = (row) => {
            return (
                <span className={styles.teachClassName}>
                    {row.combination}
                    <Icon
                        className={styles.editIcon}
                        type="edit"
                        onClick={() => this.editPos(row)}
                    />
                </span>
            );
        };

        divideResultCombinationView?.titleModels &&
            divideResultCombinationView.titleModels.map((item, index) => {
                if (index === 0) {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                        filters: filterCombination,
                        onFilter: (value, record) => {
                            return record.combination.includes(value);
                        },
                        render: (text, row, index) => {
                            return {
                                children: renderContent(row),
                                props: {
                                    rowSpan: row.span,
                                },
                            };
                        },
                    });
                } else if (index === 1) {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                        sorter: (a, b) => b.total - a.total,
                        render: (text, row, index) => {
                            return {
                                children: text,
                                props: {
                                    rowSpan: row.span,
                                },
                            };
                        },
                    });
                } else if (index === 2) {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                        render: (text, row, index) => {
                            return {
                                children: text,
                                props: {
                                    rowSpan: row.span,
                                },
                            };
                        },
                    });
                } else if (index === 3) {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                        render: (text, row, index) => {
                            return {
                                children: text,
                                props: {
                                    rowSpan: row.span,
                                },
                            };
                        },
                    });
                } else if (index === 4) {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                    });
                } else if (index === 5) {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                    });
                } else {
                    newColumns.push({
                        title: item.title,
                        dataIndex: item.field,
                        align: 'center',
                        /* filters: lotsFilter[index - 6],
                        onFilter: (value, record) => {
                            return record[item.field].includes(value);
                        }, */
                    });
                }
            });

        return (
            <div className={styles.tableStyle}>
                <Table
                    columns={newColumns}
                    dataSource={tableData}
                    pagination={false}
                    scroll={{ y: 500 }}
                    bordered
                />
                <Modal
                    title="批量调整学生分班"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className={styles.divideInfo}
                >
                    <p className={styles.stuNum}>
                        所选范围内共{devideInfo.total}
                        名学生，可同时调整学生的行政班，以及共同所选课程的教学班
                    </p>
                    <table
                        style={{ textAlign: 'center' }}
                        border="1"
                        width="868px"
                        className={styles.tableStyle}
                    >
                        {titleModelsArr}
                        {groupModels.map((item, index) => {
                            return (
                                <>
                                    <tr>
                                        <td>
                                            <Input
                                                value={groupModels[index].total}
                                                onChange={(e) => this.changeTotal(e, index)}
                                                style={{ borderRadius: '5px', width: '60px' }}
                                            ></Input>
                                        </td>
                                        {groupModels[index].courseChooseDetailModelList.map(
                                            (item3, index3) => {
                                                return (
                                                    <td>
                                                        <Select
                                                            style={{
                                                                width: '160px',
                                                                borderRadius: '5px',
                                                                margin: '5px',
                                                            }}
                                                            dropdownMatchSelectWidth={false}
                                                            onChange={(value) =>
                                                                this.changeSub(
                                                                    index3,
                                                                    value,
                                                                    groupModels[index]
                                                                        .courseChooseDetailModelList[
                                                                        index3
                                                                    ].groupId,
                                                                    index
                                                                )
                                                            }
                                                            value={
                                                                groupModels[index]
                                                                    .courseChooseDetailModelList[
                                                                    index3
                                                                ].groupId
                                                            }
                                                        >
                                                            {newCombinationDetailList &&
                                                                newCombinationDetailList[
                                                                    index3
                                                                ].map((item2, index2) => {
                                                                    return (
                                                                        <Select.Option
                                                                            key={item2.id}
                                                                            value={item2.id}
                                                                            /* styles={{
                                                                                width: '180px',
                                                                            }} */
                                                                        >
                                                                            {item2.name}
                                                                        </Select.Option>
                                                                    );
                                                                })}
                                                        </Select>
                                                    </td>
                                                );
                                            }
                                        )}
                                        <td>
                                            <Button
                                                style={{ borderRadius: '5px', margin: '5px' }}
                                                type="primary"
                                                onClick={() => this.devideRow(index)}
                                            >
                                                拆分
                                            </Button>
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                    </table>
                    <div>
                        <span></span>
                    </div>
                </Modal>
            </div>
        );
    }
}
