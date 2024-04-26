//选课列表
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import HeaderItem from './card';
import { Icon, Pagination, Skeleton, Modal, message, Button } from 'antd';
import AddCourse from './addCourse';
import { trans } from '../../../utils/i18n';

@connect((state) => ({
    semesterList: state.time.selectAllSchoolYear,
    gradeList: state.time.gradeList,
    allStage: state.time.allStage,
    subjectList: state.course.subjectList,
    schoolList: state.course.schoolList,
    choosePlanList: state.course.choosePlanList,
    currentUser: state.global.currentUser,
    powerStatus: state.global.powerStatus, //是否有权限
    planningSchoolListInfo: state.course.planningSchoolListInfo, // 机构下的学校
}))
class CourseSelect extends PureComponent {
    state = {
        pageNum: 1,
        pageSize: 12,
        isEdit: false, // 默认是新建
        visible: false, // 默认是隐藏
        initLoadData: false,
        planId: '',
        isCreate: false,
    };

    componentDidMount() {
        this.initOriginalData();
        this.ifHavePower();
    }

    //判断是否有权限
    ifHavePower() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/havePower',
            payload: {},
        }).then(() => {
            let { powerStatus } = this.props;
            if (powerStatus) {
                if (powerStatus.content.indexOf('smart:scheduling:courseSelectionCreate') != -1) {
                    this.setState({
                        isCreate: true,
                    });
                }
            }
        });
    }

    choosePlanList = (callback) => {
        const { dispatch } = this.props;
        let { pageNum, pageSize } = this.state;
        dispatch({
            type: 'course/choosePlanList',
            payload: {
                pageNum,
                pageSize,
            },
            onSuccess: () => {
                callback && callback();
            },
        });
    };
    allchoosePlanList = (callback) => {
        const { dispatch } = this.props;
        // let { pageNum, pageSize } = this.state;
        dispatch({
            type: 'course/allChoosePlanList',
            payload: {
                pageNum: 1,
                pageSize: 1000,
            },
            /* onSuccess: () => {
                callback && callback();
            }, */
        });
    };

    initOriginalData() {
        const { dispatch } = this.props;
        let p1 = new Promise((resolve, reject) => {
            //获取校区
            dispatch({
                type: 'course/getCouserPlanningSchoolList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p2 = new Promise((resolve, reject) => {
            //获取年级
            dispatch({
                type: 'time/getGradeList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p3 = new Promise((resolve, reject) => {
            //获取学年
            dispatch({
                type: 'time/selectAllSchoolYear',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p4 = new Promise((resolve, reject) => {
            //获取科目
            if (typeof courseIndex_subjectList !== 'undefined') {
                dispatch({
                    type: 'course/getCourseIndexSubjectList',
                    payload: courseIndex_subjectList,
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            } else {
                dispatch({
                    type: 'course/getSubjectList',
                    payload: {},
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            }
        });

        let p5 = new Promise((resolve, reject) => {
            this.choosePlanList(() => {
                resolve(null);
            });
        });

        let p6 = new Promise((resolve, reject) => {
            dispatch({
                type: 'global/getCurrentUser',
                payload: {},
                onSuccess: () => {
                    const { currentUser } = this.props;
                    localStorage.setItem(
                        'userIdentity',
                        currentUser && currentUser.currentIdentity
                    );
                    resolve(null);
                },
            });
        });

        let p7 = new Promise((resolve, reject) => {
            dispatch({
                type: 'time/allStage',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p8 = new Promise((resolve, reject) => {
            dispatch({
                type: 'global/getCurrentUser',
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p9 = new Promise((resolve, reject) => {
            this.allchoosePlanList(() => {
                resolve(null);
            });
        });

        // 全部加载完在去展示弹窗
        Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]).then(() => {
            this.setState({
                initLoadData: true,
            });
        });
    }

    hideModal = (type) => {
        switch (type) {
            case 'visible':
                this.setState({
                    visible: false,
                    isEdit: false,
                    planId: '',
                });
                break;
            default:
                break;
        }
    };

    editPlan = (item, event) => {
        event.stopPropagation();
        if (item.status == 4 || item.status === null || item.status === undefined) {
            this.setState({
                visible: true,
                isEdit: true,
                planId: item.id,
            });
        } else {
            message.warn(trans('course.index.not.edit', '禁止编辑'));
            return;
        }
    };

    //删除选课计划
    deleteCourse = (id, event) => {
        event.stopPropagation();
        const { dispatch } = this.props;
        let self = this;
        Modal.confirm({
            title: trans('course.index.delete.course', '是否删除该选课计划'),
            content: null,
            onOk() {
                dispatch({
                    type: 'course/chooseCourseDelete',
                    payload: { id },
                    onSuccess: (data) => {
                        self.choosePlanList();
                    },
                });
            },
            onCancel() {},
        });
    };

    sizeChange = (pageNum, pageSize) => {
        this.setState(
            {
                pageNum: 1,
                pageSize,
            },
            () => {
                this.choosePlanList();
            }
        );
    };

    pageChange = (pageNum, pageSize) => {
        this.setState(
            {
                pageNum,
                pageSize,
            },
            () => {
                this.choosePlanList();
            }
        );
    };

    noDataHTML() {
        return (
            <div className={styles.noData}>
                <div>
                    <p className={styles.title}>
                        {trans('course.index.no.course.plan', '暂无选课计划')}
                    </p>
                    <Button className={styles.btn} type="primary" onClick={this.show}>
                        {trans('course.index.new.course', '新建选课')}
                    </Button>
                </div>
            </div>
        );
    }

    show = () => {
        this.setState({
            visible: true,
            isEdit: false,
        });
    };

    isAdmin(list) {
        let { currentUser } = this.props;
        if (list && list.length > 0 && currentUser) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == currentUser.userId) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        const { choosePlanList, total } = this.props.choosePlanList;
        let { isEdit, visible, initLoadData, pageNum, pageSize, planId, isCreate } = this.state;
        if (!initLoadData) {
            return (
                <div className={styles.initLoadData}>
                    <Skeleton active />
                    <div style={{ margin: '24px 0' }}>
                        <Skeleton active />
                    </div>
                    <Skeleton active />
                </div>
            );
        }
        return (
            <div>
                <div className={styles.CourseSelect}>
                    {choosePlanList && choosePlanList.length > 0 ? (
                        <Fragment>
                            <div className={styles.header}>
                                {choosePlanList.map((item, i) => (
                                    <HeaderItem
                                        conent={item}
                                        key={i}
                                        isAdmin={this.isAdmin(item.administratorList)}
                                        dispatch={this.props.dispatch}
                                    >
                                        {
                                            // this.isAdmin(item.administratorList) ?
                                            <Fragment>
                                                <div
                                                    className={styles.headerItem}
                                                    onClick={this.editPlan.bind(this, item)}
                                                >
                                                    {trans(
                                                        'tc.base.edit.course.plan',
                                                        '编辑选课计划'
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.headerItem}
                                                    onClick={this.deleteCourse.bind(this, item.id)}
                                                >
                                                    {trans(
                                                        'tc.base.delete.course.plan',
                                                        '删除选课计划'
                                                    )}
                                                </div>
                                            </Fragment>
                                            // :
                                            // <span style={{ color: "#969fa9" }}>{trans("global.no.permission", "暂无权限")}</span>
                                        }
                                    </HeaderItem>
                                ))}
                            </div>

                            <div className={styles.Pagination}>
                                <Pagination
                                    showSizeChanger
                                    onShowSizeChange={this.sizeChange}
                                    onChange={this.pageChange}
                                    current={pageNum}
                                    defaultPageSize={pageSize}
                                    pageSizeOptions={['12', '24', '36', '72']}
                                    total={total}
                                />
                            </div>

                            {isCreate && (
                                <div className={styles.addAndEdit} onClick={this.show}>
                                    <Icon type="plus" className={styles.icon} />
                                </div>
                            )}
                        </Fragment>
                    ) : (
                        this.noDataHTML()
                    )}
                </div>
                <AddCourse
                    visible={visible}
                    isEdit={isEdit}
                    planId={planId}
                    hideModal={this.hideModal}
                    choosePlan={this.choosePlanList}
                    {...this.props}
                />
            </div>
        );
    }
}

export default CourseSelect;
