import React, { Component, Fragment } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import styles from './timetable.less';
import NavTitle from './navTitle';
import TimeTable from '../../CourseStudentDetail/CourseSchedule/ComplateSchedule/index';
import { getUrlSearch } from '../../../utils/utils';
@connect((state) => ({
    courseStartPeriodList: state.studentDetail.courseStartPeriodList,
}))
class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseIdList: [],
        };
    }

    componentDidMount() {
        this.getCourseStartPeriod();
    }

    // 开课周期列表
    getCourseStartPeriod = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'studentDetail/getCourseStartPeriod',
            payload: {
                chooseCoursePlanId: getUrlSearch('planId'),
            },
        });
    };

    onCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'visibleTimetable');
    };

    componentWillReceiveProps(nextProps) {
        let arr = [];
        nextProps.data &&
            nextProps.data.studentChooseCourseModelList &&
            nextProps.data.studentChooseCourseModelList.map((item, index) => {
                arr.push(item.courseId);
            });
        this.setState({
            courseIdList: arr,
        });
    }

    render() {
        let { visibleTimetable, courseStartPeriodList, data } = this.props;
        const { courseIdList } = this.state;
        let studentId = data && data.userDTO && data.userDTO.userId;
        return (
            <Modal
                // title={<NavTitle
                // title="课表详情"
                //  />}
                onCancel={this.onCancel}
                maskClosable={false}
                width="100%"
                footer={null}
                closable={true}
                visible={visibleTimetable}
                className={styles.timetableModal}
                style={{ top: '0', paddingBottom: '0' }}
                destroyOnClose={true}
            >
                <div className={styles.Timetable}>
                    <TimeTable
                        studentId={studentId}
                        courseIdList={courseIdList}
                        courseStartPeriodList={courseStartPeriodList}
                    />
                </div>
            </Modal>
        );
    }
}

export default Timetable;
