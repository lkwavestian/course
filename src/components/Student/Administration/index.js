//行政组织
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import SortableTree from '../../SortableTree/index';

@connect((state) => ({
    treeDataSource: state.student.treeDataSource,
}))
export default class AdministrationPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    componentWillMount() {
        this.getTreeOrg();
    }

    getTreeOrg() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getTreeData',
            payload: {},
            onSuccess: () => {
                const { treeDataSource } = this.props;
                this.setState({
                    dataSource: treeDataSource,
                });
            },
        });
    }

    //tree的状态修改
    handleExpand = (treeData) => {
        this.setState({
            dataSource: treeData,
        });
    };

    render() {
        return (
            <div className={styles.mainPage}>
                <div className={styles.leftBar}>
                    <SortableTree {...this.props} {...this.state} />
                </div>
                <div className={styles.rightContainer}>右侧主体部分</div>
            </div>
        );
    }
}
