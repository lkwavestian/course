import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Input, Icon, Modal, Select } from 'antd';
import { object } from 'prop-types';

const { Option } = Select;
@Form.create()
@connect((state) => ({
    classPro: state.devision.classPro,
    allAdjustPos: state.devision.allAdjustPos,
}))
export default class AllGrade extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            classInfo: [],
            columns: [],
            tableData: [],
            newPos: '',
            courseN: '',
            devideId: '',
            loading: false,
            groupId: '',
            posArr: [],
            editTeacher: '',
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getClassProgram();
    }

    getClassProgram = () => {
        const { dispatch } = this.props;
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'devision/getClassProgram',
            payload: {
                dividePlanId: this.props.id,
            },
        }).then(() => {
            const { classPro, num } = this.props;
            console.log('classPro', classPro);
            let posArr = [];
            for (let i = 1; i <= num; i++) {
                posArr.push({
                    flowGroupNo: i,
                    value: '课位' + i,
                });
            }

            let columns = [];
            if (classPro.titleModels) {
                classPro.titleModels.map((item, index) => {
                    // eslint-disable-next-line default-case
                    switch (index) {
                        case 0:
                            columns.push({
                                title: item.title,
                                children: item.children.map((item2, index2) => {
                                    return {
                                        title: item2.title,
                                        dataIndex: item2.field,
                                        key: item.field,
                                        align: 'center',
                                        width: 95,
                                        render: (value, row, index) => {
                                            return {
                                                children: value,
                                                props: { rowSpan: row.span },
                                            };
                                        },
                                    };
                                }),
                            });
                            break;
                        case 1:
                            columns.push({
                                title: item.title,
                                children: item.children.map((item2, index2) => {
                                    if (index2 == 0) {
                                        return {
                                            title: item2.title,
                                            dataIndex: item2.field,
                                            key: item2.field,
                                            align: 'center',
                                            width: 95,
                                            render: (text, record) => {
                                                return (
                                                    <span className={styles.teachClassName}>
                                                        {record.teachingGroupName}
                                                        <Icon
                                                            className={styles.editIcon}
                                                            type="edit"
                                                            onClick={() => this.editPos(record)}
                                                        />
                                                    </span>
                                                );
                                            },
                                        };
                                    } else {
                                        return {
                                            width: 95,
                                            title: item2.title,
                                            dataIndex: item2.field,
                                            key: item2.field,
                                            align: 'center',
                                        };
                                    }
                                }),
                            });
                            break;
                        case 2:
                            columns.push({
                                title: item.title,
                                children: item.children.map((item2, index2) => {
                                    // console.log('item2', item2);
                                    return {
                                        // width: 35,
                                        title: item2.title,
                                        dataIndex: item2.field,
                                        key: item2.field,
                                        align: 'center',
                                        render: (value, row, index) => {
                                            // console.log('value', value);
                                            return (
                                                <span
                                                    style={{ color: value === 0 ? 'black' : 'red' }}
                                                >
                                                    {value}
                                                </span>
                                            );
                                        },
                                    };
                                }),
                            });
                            break;
                        default:
                            break;
                    }
                });
            }

            let tableData = [];
            if (classPro.contentModels) {
                let arr = [];
                classPro.contentModels.map((item) => {
                    const len = item.teachingGroupOutputModels.length;
                    item.teachingGroupOutputModels.map((dataItem, index) => {
                        let stuCount = {};
                        for (let k in dataItem.groupStuMap) {
                            stuCount[k] = dataItem.groupStuMap[k];
                        }
                        arr = [
                            ...arr,
                            {
                                teachingGroupId:
                                    item.teachingGroupOutputModels[index].teachingGroupId,
                                courseName: item.courseName,
                                total: item.total,
                                arrangedTotal: item.arrangedTotal,
                                notArrangedTotal: item.notArrangedTotal,
                                teachingGroupName: item.teachingGroupOutputModels[index]
                                    ? item.teachingGroupOutputModels[index].teachingGroupName
                                    : '',
                                groupSize: item.teachingGroupOutputModels[index]
                                    ? item.teachingGroupOutputModels[index].groupSize
                                    : '',
                                courseUserJson: item.teachingGroupOutputModels[index]
                                    ? item.teachingGroupOutputModels[index].courseUserJson
                                    : '',
                                flowGroupNo: item.teachingGroupOutputModels[index]
                                    ? item.teachingGroupOutputModels[index].flowGroupNo
                                    : '',
                                averageScore: item.teachingGroupOutputModels[index]
                                    ? item.teachingGroupOutputModels[index].averageScore
                                    : '',
                                ...stuCount,
                                span: index === 0 ? len : 0,
                            },
                        ];
                        return arr;
                    });
                    return arr;
                });
                tableData = arr.map((item, index) => {
                    item.key = index;
                    return item;
                });
                console.log('tableData', tableData);
            }

            this.setState({
                tableData: tableData,
                columns: columns,
                loading: false,
                posArr: posArr,
            });
        });
    };

    editPos = (e) => {
        console.log('e', e);
        this.setState({
            groupId: e.teachingGroupId,
            visible: true,
            courseN: e.teachingGroupName,
            editTeacher: e.courseUserJson,
            newPos: e.flowGroupNo,
        });
    };

    handleOk = () => {
        const { dispatch } = this.props;
        const { courseN, newPos, groupId, editTeacher } = this.state;
        this.setState({
            visible: false,
        });
        dispatch({
            type: 'devision/handleOkAdjust',
            payload: {
                dividePlanId: this.props.id,
                groupId: groupId,
                newName: courseN,
                flowGroupNo: newPos,
                courseUserJson: editTeacher,
            },
        }).then(() => {
            this.setState({
                courseN: '',
                devideId: '',
                newPos: '',
                groupId: '',
                editTeacher: '',
            });
            this.getClassProgram();
        });
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
            courseN: '',
            devideId: '',
            newPos: '',
            groupId: '',
            editTeacher: '',
        });
    };

    handleChange = (value) => {
        this.setState({
            newPos: value,
        });
    };

    changeCourseName = (e) => {
        this.setState({
            courseN: e.target.value,
        });
    };

    changeTeacherName = (e) => {
        this.setState({
            editTeacher: e.target.value,
        });
    };

    render() {
        const { tableData, columns, newPos, courseN, loading, posArr, editTeacher } = this.state;
        console.log('posArr :>> ', posArr);
        console.log('newPos', newPos);
        return (
            <div>
                <Modal
                    title="编辑班级"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className={styles.setPos}
                >
                    <div>
                        <p style={{ marginBottom: '20px' }}>
                            <span style={{ marginRight: '21px', fontWeight: '900' }}>
                                班级名称:
                            </span>
                            <Input
                                value={courseN}
                                style={{ width: '220px' }}
                                onChange={this.changeCourseName}
                            />
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            <span style={{ marginRight: '50px', fontWeight: '900' }}>课位:</span>
                            <Select
                                placeholder="请选择课位"
                                style={{ width: 220 }}
                                value={newPos}
                                onChange={this.handleChange}
                            >
                                {posArr &&
                                    posArr.map((item, index) => {
                                        return (
                                            <Option value={item.flowGroupNo} key={item.flowGroupNo}>
                                                {item.value}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </p>
                        <p style={{ marginBottom: '20px', display: 'flex', marginLeft: '52px' }}>
                            <span
                                style={{ marginRight: '48px', marginTop: '6px', fontWeight: '900' }}
                            >
                                教师:
                            </span>
                            <Input
                                value={editTeacher}
                                // placeholder="陈龙（信息技术）、陈军辉（通用技术）"
                                style={{ width: 220 }}
                                onChange={this.changeTeacherName}
                            />
                        </p>
                        <p>
                            <span
                                style={{
                                    display: 'block',
                                    width: '366px',
                                    paddingLeft: '129px',
                                    textAlign: 'initial',
                                }}
                            >
                                若教学班有多门课填写示例：陈龙（信息技术）、陈军辉（通用技术）
                            </span>
                        </p>
                    </div>
                </Modal>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    bordered
                    pagination={false}
                    scroll={{ y: 500 }}
                    className={styles.relatedPartyMaint}
                />
            </div>
        );
    }
}
