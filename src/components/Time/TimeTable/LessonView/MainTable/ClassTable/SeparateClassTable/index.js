import React, { Fragment, PureComponent } from 'react';
import { Resizable } from 're-resizable';
import { connect } from 'dva';
import { Spin, Row, Col, Popover, message, Icon } from 'antd';
import { isEmpty, remove } from 'lodash';
import styles from './index.less';
import { intoChineseNumber } from '../../../../../../../utils/utils';

import PopoverContentLessonView from '../../../../CustomCourse/popoverContentLessonView';
import CustomClassTable from '../../../CustomTable/CustomClassTable';

let lookDetailTimeOut = null; //防止双击出发单击两次

@connect((state) => ({
    lessonViewTableLoading: state.lessonView.lessonViewTableLoading,
    lessonViewScheduleData: state.lessonView.lessonViewScheduleData,
    customTableRowCount: state.lessonView.customTableRowCount,
}))
export default class SeparateClassTable extends PureComponent {
    getClassSchedule = (customScheduleData) => {
        const { customTableRowCount } = this.props;
        return (
            <Col span={24 / customTableRowCount} style={{ marginBottom: 20 }}>
                <CustomClassTable
                    classSchedule={customScheduleData}
                    {...this.props}
                    location="SeparateClassTable"
                />
            </Col>
        );
    };

    render() {
        const { lessonViewScheduleData, lessonViewTableLoading } = this.props;
        return (
            <Spin spinning={lessonViewTableLoading} style={{ width: '100%' }}>
                <Row gutter={[{ xs: 8, sm: 16, md: 24 }]}>
                    {lessonViewScheduleData
                        .filter((item) => !item.view)
                        .map((item) => this.getClassSchedule(item))}
                </Row>
            </Spin>
        );
    }
}
