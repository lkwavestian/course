import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table } from 'antd';

@Form.create()
@connect((state) => ({
    allAdminScore: state.devision.allAdminScore,
}))
export default class AllGrade extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            newCol: [],
            filters: [],
            exportIdLists: undefined,
            loading: false,
        };
    }

    componentDidMount() {
        this.getGrade(this.props.id);
    }

    exportToBack = () => {
        const { dispatch } = this.props;
        const { exportIdLists } = this.state;
        dispatch({
            type: 'devision/exportToBack',
            payload: {
                devideId: this.props.id,
                idLists: exportIdLists,
            },
        });
    };

    getGrade = (id) => {
        const { dispatch } = this.props;
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'devision/getAdminScore',
            payload: {
                dividePlanId: id,
            },
        }).then(() => {
            const { allAdminScore } = this.props;

            //静态表头
            this.setState({
                loading: false,
            });
        });
    };

    render() {
        const { columns, newCol, filters, loading } = this.state;
        const { allAdminScore } = this.props;

        //静态表头
        const staticColumns = [
            {
                title: '班级',
                dataIndex: 'adminClassName',
                align: 'center',
            },
            /* {
                title: '班型',
                dataIndex: 'classType',
                align: 'center',
                filters: filters,
                onFilter: (value, record) => record.classType.includes(value),
            }, */
            {
                title: '总人数',
                dataIndex: 'totalNumber',
                align: 'center',
            },
            {
                title: '男',
                dataIndex: 'boyNumber',
                align: 'center',
            },
            {
                title: '女',
                dataIndex: 'girlNumber',
                align: 'center',
            },
            {
                title: '总分',
                dataIndex: 'totalScore',
                align: 'center',
                sorter: (a, b) => a - b,
            },
            {
                title: '语文',
                dataIndex: 'Chinese',
                align: 'center',
                sorter: (a, b) => a - b,
            },
            {
                title: '数学',
                dataIndex: 'Math',
                align: 'center',
                sorter: (a, b) => a - b,
            },
            {
                title: '英语',
                dataIndex: 'English',
                align: 'center',
                sorter: (a, b) => a - b,
            },
            {
                title: '物理',
                dataIndex: 'physics',
                align: 'center',
                sorter: (a, b) => a - b,
            },
            {
                title: '化学',
                dataIndex: 'chemistry',
                align: 'center',
                sorter: (a, b) => a - b,
            },
        ];

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
                    // columns={newCol}
                    columns={staticColumns}
                    // dataSource={allAdminScore.classData}
                    dataSource={allAdminScore}
                    rowSelection={rowSelection}
                    loading={loading}
                    scroll={{ y: 580 }}
                    pagination={false}
                />
            </div>
        );
    }
}
