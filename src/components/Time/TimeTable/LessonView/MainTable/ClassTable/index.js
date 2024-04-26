import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { isEmpty } from 'lodash';

import SeparateClassTable from './SeparateClassTable';

@connect((state) => ({
    mainScheduleData: state.lessonView.mainScheduleData,
    currentSideBar: state.lessonView.currentSideBar,
}))
export default class ClassTable extends Component {
    handleAddSideBarClick = () => {
        const { dispatch, mainScheduleData } = this.props;
        dispatch({
            type: 'lessonView/setSideBarVisible',
            payload: 'reduceSideBar',
        });
        this.setCustomTableRowCountBySelectValue(mainScheduleData.scheduleData);
    };
    setCustomTableRowCountBySelectValue = (value) => {
        console.log('value :>> ', value);
        const { dispatch } = this.props;
        let calculateRowCount = (value) => {
            if (isEmpty(value)) return 1;
            if (value.length === 1) return 1;
            if (value.length === 2) return 2;
            if (value.length >= 3) return 3;
        };
        dispatch({
            type: 'lessonView/setCustomTableRowCount',
            payload: calculateRowCount(value),
        });
    };
    render() {
        const { currentSideBar } = this.props;
        return (
            <Fragment>
                <SeparateClassTable {...this.props} />
                <div
                    className={styles.addSideBar}
                    onClick={this.handleAddSideBarClick}
                    style={{ display: currentSideBar === 'addSideBar' ? 'block' : 'none' }}
                >
                    <div className={styles.addTriangle}></div>
                </div>
            </Fragment>
        );
    }
}
