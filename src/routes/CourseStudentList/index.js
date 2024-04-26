//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import StudentList from '../../components/CourseStudentList/index';
import BasicHeader from '../../layouts/BasicLayout';
import { getUrlSearch } from '../../utils/utils';

@connect()
export default class CourseStudentList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: '0',
            listHeight: document.body.clientHeight - 60,
        };
    }

    componentWillMount() {
        console.log(this.props.location, 'modalVisible--did');
        document.getElementsByTagName('title')[0].innerHTML = '选课';
        this.props.dispatch({
            type: 'studentDetail/getOpenStatus',
            payload: {
                open: this.props.location.isNeedOpen,
            },
        });
    }

    switchNavList = (key) => {};

    render() {
        const { cur, listHeight } = this.state;
        const navList = [
            {
                name: `${trans('list.header.tab', '选课')}`,
                key: '0',
            },
        ];
        let isIPad = getUrlSearch('isIPad') === 'true' ? true : false;
        const { isNeedOpen } = this.props.location;
        return (
            <div className={styles.CourseStudentList}>
                {!isIPad && (
                    <BasicHeader
                        navList={navList}
                        cur={cur}
                        switchNavList={this.switchNavList}
                        isNeedOpen={isNeedOpen}
                    />
                )}
                <div className={styles.studentList} style={{ minHeight: listHeight }}>
                    <StudentList />
                </div>
            </div>
        );
    }
}
