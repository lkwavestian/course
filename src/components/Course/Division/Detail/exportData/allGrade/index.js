import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Radio, Steps, Divider, Checkbox } from 'antd';

@Form.create()
@connect((state) => ({
    importStudentScoreList: state.devision.importStudentScoreList,
}))
export default class AllGrade extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // columns: [],
            // studentScoreTitle: [],
            // dataSource: [],
            // courseName: [],
            // stuScore: [],
            loading: false,
        };
    }

    componentDidMount() {
        console.log('this', this);
        // this.props.onRef(this);
        // this.getImportStudentScore(this.props.id);
        this.props.getImportStudentScore(this.props.id);
    }

    // getImportStudentScore = (id) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'devision/importStudentScoreList',
    //         payload: {
    //             divideGroupId: this.props.id,
    //         },
    //     }).then(() => {
    //         const { importStudentScoreList } = this.props;
    //         const { columns } = this.state;
    //         console.log('this.props.importStudentScoreListk', this.props.importStudentScoreList);
    //         // let columns = [];
    //         // importStudentScoreList.title.map((item, index) => {
    //         //     columns.push({
    //         //         title: item.split('-')[0],
    //         //         dataIndex: item.split('-')[1],
    //         //     });
    //         // });
    //         // console.log('columns', columns);
    //         // // const courseNameList = importStudentScoreList.result.map((item) => {
    //         // //     return item.divideStudentCourseScoreDTOList.map((item1) => {
    //         // //         return item1;
    //         // //     });
    //         // // });
    //         // // console.log('courseNameList', courseNameList);
    //         // let dataSource = [];
    //         // importStudentScoreList.result.map((item, index) => {
    //         //     let courseNameList = item.divideStudentCourseScoreDTOList.map((item1) => {
    //         //         return item1;
    //         //     });
    //         //     console.log('courseNameList', courseNameList);
    //         //     dataSource.push({
    //         //         key: item.studentId,
    //         //         studentName: item.studentName,
    //         //         oldAdminClassName: item.oldAdminClassName,
    //         //         // ...courseNameList,
    //         //     });
    //         // });

    //         // console.log('dataSource', dataSource);
    //         this.setState({
    //             studentScoreTitle: importStudentScoreList.title,
    //             stuScore: importStudentScoreList.result,
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
        const { stuScore, loading, columns } = this.state;
        const { importStudentScoreList } = this.props;
        console.log('importStudentScoreList', importStudentScoreList);
        console.log('importStudentScoreList.title', importStudentScoreList.title);
        let titleRow = [];
        let titleList = importStudentScoreList.title && Object.keys(importStudentScoreList.title);
        console.log('titleList', titleList);
        titleList &&
            titleList.map((item, index) => {
                titleRow.push({
                    title: importStudentScoreList.title[item],
                    dataIndex: item,
                    align: 'center',
                });
            });
        let dataResult = [];
        // let dataResultList =
        //     importStudentScoreList.result &&
        //     importStudentScoreList.result.map((item, index) => {
        //         return item;
        //     });
        console.log('importStudentScoreList', importStudentScoreList && importStudentScoreList);
        console.log(
            'importStudentScoreList.result',
            importStudentScoreList.result && importStudentScoreList.result
        );
        let dataResultList =
            importStudentScoreList?.result &&
            JSON.parse(JSON.stringify(importStudentScoreList.result).replaceAll('null', ''));

        console.log('dataResultList', dataResultList);
        const pagination = {
            showSizeChanger: true,
            onChange: () => this.onShowSizeChange(),
            defaultCurrent: 1,
            total: 200,
        };
        return (
            <div>
                <Table
                    columns={titleRow}
                    // dataSource={this.props.stuScore}
                    dataSource={dataResultList}
                    // pagination={pagination}
                    // loading={this.loading}
                />
            </div>
        );
    }
}
