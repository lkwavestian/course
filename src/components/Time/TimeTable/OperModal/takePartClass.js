import React, { Component } from 'react';
import styles from '../OperModal/commonModal.less';
import { Modal, Checkbox, Row, Col, message } from 'antd';
import { connect } from 'dva';

@connect((state) => ({
    customGradeList: state.timeTable.customGradeList,
}))
export default class TakePartClass extends Component {
    state = {
        selectedGradeIdList: [],
        loading: false,
        confirmModalVisible: false,
    };

    changeGradeList = (selectedGradeIdList) => {
        this.setState({
            selectedGradeIdList,
        });
    };

    splitContinuousResult = () => {
        const { dispatch, currentVersion } = this.props;
        const { selectedGradeIdList } = this.state;
        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/splitContinuousResult',
                    payload: {
                        versionId: currentVersion,
                        gradeIdList: selectedGradeIdList,
                    },
                    onSuccess: () => {
                        const { fetchScheduleList, getCourseAndGroup } = this.props;
                        typeof getCourseAndGroup == 'function' &&
                            getCourseAndGroup(undefined, undefined, false); // 请求待排课
                        //刷新课程表
                        typeof fetchScheduleList == 'function' && fetchScheduleList.call(this); // ok
                    },
                }).then(() => {
                    this.setState({
                        loading: false,
                    });
                    const { changeTakePartClassVisible } = this.props;
                    changeTakePartClassVisible(false);
                    this.toggleConfirmModalVisible();
                });
            }
        );
    };

    toggleConfirmModalVisible = () => {
        const { confirmModalVisible } = this.state;
        this.setState({
            confirmModalVisible: !confirmModalVisible,
        });
    };

    render() {
        const { takePartClassVisible, changeTakePartClassVisible, customGradeList } = this.props;
        const { loading, confirmModalVisible } = this.state;
        return (
            <div>
                <Modal
                    wrapClassName={styles.commonModal + ' ' + styles.takePartClass}
                    visible={takePartClassVisible}
                    title="一键拆连堂"
                    onCancel={() => changeTakePartClassVisible(false)}
                    onOk={this.toggleConfirmModalVisible}
                >
                    <div className={styles.mainContent}>
                        <div className={styles.contentItem}>
                            <span className={styles.leftText}>
                                <span className={styles.icon}>*</span>
                                <span>年级范围：</span>
                            </span>
                            <Checkbox.Group
                                className={styles.rightText}
                                onChange={this.changeGradeList}
                            >
                                <Row>
                                    {customGradeList.map((item) => (
                                        <Col span={8}>
                                            <Checkbox value={item.id}>{item.name}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </div>
                        <div className={styles.contentItem}>
                            <span className={styles.leftText}>拆分说明：</span>
                            <span className={styles.rightText}>
                                拆分后已排课节仍在原节次，方便按单堂进行换课。
                                待排课节1个连堂会变为2个单堂。
                            </span>
                        </div>
                    </div>
                </Modal>
                <Modal
                    width={430}
                    visible={confirmModalVisible}
                    wrapClassName={styles.commonModal + ' ' + styles.confirmModal}
                    okText="确认拆分"
                    onOk={this.splitContinuousResult}
                    onCancel={this.toggleConfirmModalVisible}
                    confirmLoading={loading}
                >
                    <div className={styles.confirmContent}>
                        确认将所选年级范围内的全部连堂拆分为单堂吗？
                    </div>
                </Modal>
            </div>
        );
    }
}
