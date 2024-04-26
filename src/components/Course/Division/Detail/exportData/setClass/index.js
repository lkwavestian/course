import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Tabs, Radio, Steps, Divider, Checkbox, Table } from 'antd';

@Form.create()
@connect((state) => ({
    importStudentClassList: state.devision.importStudentClassList,
}))
export default class SetClass extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // this.getImportStudentClass(this.props.id);
        // this.props.onRef(this);
        this.props.getImportStudentClass(this.props.id);
    }

    // getImportStudentClass = (id) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'devision/importStudentClassList',
    //         payload: {
    //             divideGroupId: id,
    //         },
    //     }).then(() => {
    //         const { importStudentClassList } = this.props;
    //         this.setState({
    //             gradeName: importStudentClassList.className,
    //             stuClass: importStudentClassList.studentList,
    //             loading: false,
    //         });
    //     });
    //     this.setState({
    //         loading: true,
    //     });
    // };

    onShowSizeChange = (current, pageSize) => {
        console.log('pagination', current, pageSize);
    };

    render() {
        const { stuClass, loading } = this.state;
        const columns = [
            {
                title: '班级',
                dataIndex: 'gradeClass',
                align: 'center',
                /* render: (text, record) => (
          <div style={{ width: '100px'}}>
            {text}
          </div>
        ), */
            },
            {
                title: '类型',
                dataIndex: 'typeClass',
                align: 'center',
                /* render: (text, record) => (
          <div style={{ width: '100px'}}>
            {text}
          </div>
        ),
        width:100 */
            },
            {
                title: '学科',
                dataIndex: 'subject',
                align: 'center',
                /* render: (text, record) => (
          <div style={{ width: '100px'}}>
            {text}
          </div>
        ),
        width:100 */
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
        const pagination = {
            showSizeChanger: true,
            onChange: () => this.onShowSizeChange(),
            defaultCurrent: 1,
            total: 20,
        };
        return (
            <div>
                <Table
                    columns={columns}
                    // dataSource={stuClass}
                    dataSource={this.props.stuClass}
                    rowSelection={rowSelection}
                    loading={this.props.loading}
                    pagination={pagination}
                />
            </div>
        );
    }
}
