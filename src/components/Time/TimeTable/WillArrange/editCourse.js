//查询某课程下周课时计划--修改课程
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../../../icon.less';
import CardUtil from './cardUtil';
import { Modal, message, Icon } from 'antd';
import { trans, locale } from '../../../../utils/i18n';
import TakePartClass from '../OperModal/takePartClass';

const confirm = Modal.confirm;

@connect((state) => ({
    classCourseList: state.timeTable.classCourseList,
    teacherList: state.course.teacherList,
}))
export default class EditCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.pw = React.createRef();
        this.state = {
            confirmModalVisible: false,
            loading: false,
        };

        this.child = null;
    }

    componentDidMount() {
        this.findWeekCoursePlanning();
    }

    //周课时计划列表
    findWeekCoursePlanning = () => {
        const { dispatch, currentVersion, selectCourseId } = this.props;
        dispatch({
            type: 'timeTable/findWeekCoursePlanning', // 查询某课程下周课时计划接口
            payload: {
                weekVersionId: currentVersion, //版本id
                courseIds: selectCourseId ? [selectCourseId] : [], //课程id，因为模型原因，所以需要将课程id放入到数组中
            },
        });
    };

    hideModal = (type) => {
        const { hideEditModal } = this.props;
        typeof hideEditModal == 'function' && hideEditModal(type);
    };

    handleOk = () => {};

    //批量删除行
    deleteAllRow(ids) {
        const { dispatch, classCourseList } = this.props;
        let self = this;
        confirm({
            title: '您确定要删除该课程所有待排和已排课节吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'timeTable/deletePlanningAllRow', // 确认删除接口
                    payload: {
                        idList: ids,
                    },
                    onSuccess: () => {
                        //重新调用计划列表
                        self.findWeekCoursePlanning(); // ok
                        //调用待排课程卡片列表
                        const { showTable, getCourseAndGroup } = self.props;
                        typeof getCourseAndGroup == 'function' &&
                            getCourseAndGroup(undefined, undefined, false); // 请求待排课
                        //刷新课程表
                        typeof showTable == 'function' && showTable.call(this); // ok

                        //关闭对话框
                        self.hideModal('deleAll'); // ok
                    },
                });
            },
            onCancel() {},
        });
    }

    //验证必填
    validatorCourseDetail() {
        const { classCourseList } = this.props;
        let result = true;
        let groups = classCourseList.groups;
        for (let i = 0; i < groups.length; i++) {
            let weekCoursePlanningOutputModelList = groups[i].weekCoursePlanningOutputModelList;
            for (let j = 0; j < weekCoursePlanningOutputModelList.length; j++) {
                if (!weekCoursePlanningOutputModelList[j].unitDuration) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    //点击保存周计划
    saveAllRow = () => {
        const { dispatch, classCourseList, activeTab } = this.props;
        console.log('classCourseList :>> ', classCourseList);
        let self = this;
        let newReplaceWeekLesson = this.replaceWeekLesson(classCourseList);
        console.log('newReplaceWeekLesson :>> ', newReplaceWeekLesson);
        if (!classCourseList.groups) {
            //groups为空则已经全部删除完了，直接关闭
            //关闭对话框
            this.hideModal();
            return false;
        } else {
            if (!this.validatorCourseDetail()) {
                message.info('请完善课程信息');
                return false;
            }
            dispatch({
                type: 'timeTable/saveWeekCoursePlanning',
                payload: this.replaceWeekLesson(classCourseList),
                onSuccess: () => {
                    //关闭对话框
                    this.hideModal();
                    //调用待排课程卡片列表
                    const { selectCourseId, selectGroupId, showTable, getCourseAndGroup } =
                        self.props;

                    //编辑完成是否需要刷新待排课程表 待确认
                    let course = selectCourseId ? selectCourseId : '',
                        grade = selectGroupId ? selectGroupId : '';
                    typeof getCourseAndGroup == 'function' && getCourseAndGroup(course, grade);
                    //刷新课程表
                    typeof showTable == 'function' && showTable.call(self, '编辑周计划');
                },
            });
        }
    };

    replaceWeekLesson(data) {
        for (const item of data.groups) {
            item.weekCoursePlanningOutputModelList.map((el) => {
                el.weekLessons = el.newWeekLessons || el.weekLessons;
            });
        }
        return data;
    }

    //获取所有id
    getGroupId = (groupArr) => {
        let idList = [];
        groupArr &&
            groupArr.length > 0 &&
            groupArr.map((item, index) => {
                return (
                    item.weekCoursePlanningOutputModelList &&
                    item.weekCoursePlanningOutputModelList.length > 0 &&
                    item.weekCoursePlanningOutputModelList.map((el) => {
                        if (el.id) {
                            idList.push(el.id);
                        }
                    })
                );
            });
        return idList;
    };

    //处理待排课节数量
    handleStatisticCourse = (arr) => {
        if (!arr || arr.length <= 0) return '';
        let courseResult = [];
        arr.map((item) => {
            let str = item.singleTime + 'min ' + item.duration + '个';
            courseResult.push(str);
        });
        return courseResult.join('/');
    };

    toggleConfirmModalVisible = () => {
        const { lastPublish } = this.props;
        const { confirmModalVisible } = this.state;
        if (lastPublish) {
            message.info('当前课表已公布，不允许进行拆连堂操作');
            return;
        }
        this.setState({
            confirmModalVisible: !confirmModalVisible,
        });
    };

    splitContinuousResult = () => {
        const { dispatch, currentVersion, selectCourseId, hideEditModal } = this.props;
        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/splitContinuousResult',
                    payload: {
                        versionId: currentVersion,
                        courseIdList: [selectCourseId],
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
                    this.toggleConfirmModalVisible();
                    hideEditModal();
                });
            }
        );
    };

    render() {
        const { selectCourseName, editCourseModal, classCourseList, teacherList, fetCourseNum } =
            this.props;
        const { confirmModalVisible, loading } = this.state;
        let ids = [];
        return (
            <div>
                <Modal
                    title={selectCourseName}
                    visible={editCourseModal}
                    footer={null}
                    width="1400px"
                    height="100vh"
                    onCancel={this.hideModal}
                    style={{ zIndex: 1034 }}
                    wrapClassName={styles.editCourse}
                >
                    <div className={styles.cardList}>
                        {classCourseList &&
                            classCourseList.groups &&
                            classCourseList.groups.length > 0 &&
                            classCourseList.groups.map((item, index) => {
                                ids = this.getGroupId(classCourseList.groups);
                                return (
                                    <CardUtil
                                        key={index}
                                        fatherKey={index}
                                        courseItemDetail={item}
                                        {...this.props}
                                        findWeekCoursePlanning={this.findWeekCoursePlanning}
                                        onRef={(ref) => {
                                            this.child = ref;
                                        }}
                                        versionId={this.props.currentVersion}
                                        selectId={this.props.selectCourseId}
                                    />
                                );
                            })}
                    </div>
                    <div className={styles.saveAndDelete}>
                        <span className={styles.iconList}>
                            <span
                                className={styles.deleteBtn}
                                onClick={this.deleteAllRow.bind(this, ids)}
                            >
                                <i className={icon.iconfont}>&#xe739;</i>
                                删除该课程所有待排和已经排课节
                            </span>
                            <span
                                className={styles.deleteBtn}
                                onClick={this.toggleConfirmModalVisible}
                            >
                                <Icon type="column-width" />
                                将该课程全部连堂拆为单堂（已排结果不变）
                            </span>
                        </span>

                        <span className={styles.saveBtn} onClick={this.saveAllRow}>
                            {trans('global.save', '保存')}
                        </span>
                    </div>
                </Modal>
                <Modal
                    style={{ zIndex: 1035 }}
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
