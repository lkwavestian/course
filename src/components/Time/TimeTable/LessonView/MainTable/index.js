import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './index.less';
import ClassTable from './ClassTable';
import OtherTable from './OtherTable';
@connect((state) => ({
    customCourseSearchIndex: state.lessonView.customCourseSearchIndex,
}))
export default class MainTable extends Component {
    render() {
        const { customCourseSearchIndex } = this.props;
        return (
            <div className={styles.lessonViewTimeTableWrapper} id="lessonViewTimeTableWrapper">
                {customCourseSearchIndex == 0 ? <ClassTable {...this.props} /> : <OtherTable />}
            </div>
        );
    }
}
