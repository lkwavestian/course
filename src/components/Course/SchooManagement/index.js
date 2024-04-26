import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Button } from 'antd';

@Form.create()
@connect((state) => ({
    ToDetailId: '',
    editDataList: state.application.editDataList,
    dataList: state.application.dataList,
}))
export default class SchoolManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'application/dataList',
            payload: {},
            onSuccess: () => {
                const { dataList } = this.props;
                console.log('dataList', dataList);
            },
        }) /* .then(() => {
            
        }) */;
    }

    render() {
        const {
            dataList: {
                schoolId,
                registerUserName,
                registerPhone,
                registerQQ,
                schoolName,
                provinceId,
                cityId,
                areaId,
                studentGroupNum,
                teacherNum,
                stageList,
                headUserName,
                headUserPosition,
                headUserPhone,
                domainName,
                openStageNameList,
                purchaseModuleList,
            },
        } = this.props;
        const { dataList } = this.props;
        // const dataSource = [
        //     {
        //         key: '1',
        //         schoolId,
        //         registerSchoolName,
        //         openStageList,
        //         registerPhone, //负责人：headUserPhone
        //         domainName,
        //         purchaseModuleList,
        //         manage: '编辑查看',
        //     },
        // ];

        const columns = [
            {
                title: '学校ID',
                dataIndex: 'schoolId',
                key: 'name',
            },
            {
                title: '学校名称',
                dataIndex: 'schoolName',
                key: 'age',
            },
            {
                title: '开通学段',
                dataIndex: 'openStageNameList',
                key: 'address',
            },
            {
                title: '联系手机',
                dataIndex: 'registerPhone',
                key: 'name',
                render: (text, row, index) => (
                    <div>
                        <span>
                            {row.registerUserName}：{row.registerPhone}
                        </span>
                        <br />
                        <span>
                            {row.headUserName}：{row.headUserPhone}
                        </span>
                    </div>
                ),
            },
            {
                title: '学校域名',
                dataIndex: 'domainName',
                key: 'age',
            },
            {
                title: '可用模块',
                dataIndex: 'purchase',
                key: 'address',
                render: (text, record, index) => {
                    return (
                        record.purchaseModuleList &&
                        record.purchaseModuleList.map((item, index2) => {
                            return (
                                <>
                                    {item}
                                    {index2 == record.purchaseModuleList.length - 1 ? '' : <br />}
                                </>
                            );
                        })
                    );
                },
            },
            {
                title: '管理',
                dataIndex: 'manage',
                key: 'address',
                render: (text, row) => (
                    <Link to={`/school/application?schoolId=${row.schoolId}`}>编辑查看</Link>
                ),
            },
        ];
        return (
            <div className={styles.content}>
                <Button type="primary">添加学校</Button>
                <Table dataSource={dataList} columns={columns} />
            </div>
        );
    }
}
