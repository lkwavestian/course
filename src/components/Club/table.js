//club课表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Radio, message, Button, Icon } from 'antd';
import styles from './table.less';
import icon from '../../icon.less';
import { preciseTime } from '../../utils/utils';
import EditSystemCourse from '../Time/TimeTable/OperModal/editCourse.js';
import EditFreedomCourse from '../Time/TimeTable/FreedomCourse/edit';
import { locale } from '../../utils/i18n';

@connect((state) => ({
    courseDetail: state.timeTable.courseDetail,
    freeCourseDetail: state.timeTable.freeCourseDetail,
    accountCourseNum: state.timeTable.accountCourseNum, //删除多次操作涉及到的课程数量
    getPublishResultList: state.course.publishResult,
}))
export default class ClubTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            type: 1,
            deleteCourseId: '',
            ifRepeated: '',
            showEditFreedomCourse: false, //编辑活动、个人课程、club的弹窗
            showEditCourse: false, //编辑ac自由排课的弹窗
            ifpublish: undefined,
            personnel: undefined,
            publish: false,
            requiredField: true,
            selectedRows: [],
            selectedRowKeys: [],
        };
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    //格式化教师&&学生
    atTeacher = (teacherList) => {
        if (!teacherList || teacherList.length <= 0) return;
        return teacherList.map((item) => {
            return (
                <em className={styles.teacherMain} key={item.id}>
                    {item.name}
                </em>
            );
        });
    };

    //格式化类型
    formatType = (type) => {
        let typeContent = '';
        switch (type) {
            case 1:
                typeContent = '课程';
                break;
            case 2:
                typeContent = '活动';
                break;
            case 3:
                typeContent = 'CLUB';
                break;
            case 4:
                typeContent = '个人课程';
                break;
        }
        return typeContent;
    };

    //删除club
    deleteCourse(id, ifRepeated) {
        this.setState({
            showModal: true,
            deleteCourseId: id,
            ifRepeated: ifRepeated,
        });
    }

    //取消
    handleCancel = () => {
        this.setState({
            showModal: false,
            type: 1,
            ifpublish: undefined,
            personnel: undefined,
            publish: false,
            requiredField: true,
        });
    };

    //切换删除类型
    changeDeleteType = (e) => {
        this.setState(
            {
                type: e.target.value,
            },
            () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'timeTable/confirmCourseNum',
                    payload: {
                        freeResultId: this.state.deleteCourseId,
                    },
                });
            }
        );
    };
    //是否公布
    onChangeGroup = (e) => {
        this.setState({
            requiredField: false,
            ifpublish: e.target.value,
        });
    };
    //选择人员
    checkboxGroup = (value) => {
        this.setState({
            personnel: value,
        });
    };

    //确认删除
    handleOk = () => {
        const { dispatch, getClubDataSource } = this.props;
        let self = this;
        dispatch({
            type: 'course/getPublishResult',
            payload: {
                resultType: 3,
                resultId: self.state.deleteCourseId,
            },
        }).then(() => {
            if (this.props.getPublishResultList) {
                this.setState({
                    publish: true,
                });
            } else {
                dispatch({
                    type: 'timeTable/deleteFreeCourse',
                    payload: {
                        id: this.state.deleteCourseId,
                        ifSingleTime: this.state.type == 1 ? true : false,
                    },
                    onSuccess: () => {
                        //取消modal
                        this.handleCancel();
                        //请求table数据
                        typeof getClubDataSource == 'function' && getClubDataSource.call(this);
                    },
                });
            }
        });
    };

    //保存并公布
    confirmDeleteCoure = () => {
        const { deleteCourseId, type, personnel, publish } = this.state;
        const { dispatch, getClubDataSource } = this.props;

        dispatch({
            type: 'timeTable/deleteFreeCourse',
            payload: {
                id: deleteCourseId,
                ifSingleTime: type == 1 ? true : false,
                // publish: ifpublish,
                publish,
                noticeIdentities: personnel,
            },
            onSuccess: () => {
                //取消modal
                this.handleCancel();
                //请求table数据
                typeof getClubDataSource == 'function' && getClubDataSource.call(this);
            },
        }).then(() => {
            this.setState({
                ifpublish: undefined,
                personnel: undefined,
            });
        });
    };

    //查询自由排课的详情
    lookCourseDetial = (type, id, callback) => {
        const { dispatch } = this.props;
        let url = 'timeTable/lookFreeCourseDetail';
        dispatch({
            type: url,
            payload: {
                id: id,
            },
            onSuccess: () => {
                callback();
            },
        });
    };

    //编辑自由排课
    editCourse(detial) {
        //type: 1.自由排课 2.活动 3.club 4.个人课程
        if (detial.type == 1) {
            message.info('ac自由排课暂且不能编辑哦~');
            return false;
        } else {
            this.lookCourseDetial(detial.type, detial.id, () => {
                if (detial.type == 1) {
                    this.setState({
                        showEditCourse: true,
                    });
                } else {
                    this.setState({
                        editFreeType: detial.type,
                        showEditFreedomCourse: true,
                    });
                }
            });
        }
    }

    //取消编辑自由排课
    hideEditFreeModal = () => {
        this.setState({
            showEditFreedomCourse: false,
        });
    };

    //取消系统排课编辑
    hideSystemModal = () => {
        this.setState({
            showEditCourse: false,
        });
    };

    gbCancel = () => {
        this.handleCancel();
    };

    gbOk = () => {
        this.confirmDeleteCoure();
    };

    formatTeacher = (teacherList) => {
        if (!teacherList || teacherList.length <= 0) return;
        return teacherList.map((item) => {
            return (
                <em className={styles.teacherMain} key={item.id}>
                    {item.name}
                </em>
            );
        });
    };

    isSameDay = (oldDate, newDate) => {
        return new Date(oldDate).toDateString() === new Date(newDate).toDateString;
    };

    reset = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    render() {
        const { clubDataSource, accountCourseNum } = this.props;
        const {
            showModal,
            type,
            ifRepeated,
            publish,
            ifpublish,
            showEditCourse,
            showEditFreedomCourse,
            selectedRowKeys,
        } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        let self = this;

        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                });
            },
        };
        let columns = [
            {
                title: '名称',
                dataIndex: 'courseName',
                key: 'courseName',
                width: '16%',
            },
            {
                title: '时间',
                key: 'time',
                width: '16%',
                render: function (text, record) {
                    return (
                        <span>
                            {preciseTime(text.startDate).slice(0, 10) ==
                            preciseTime(text.endDate).slice(0, 10) ? (
                                <>
                                    {preciseTime(text.startDate)} -{' '}
                                    {preciseTime(text.endDate).slice(11)}{' '}
                                </>
                            ) : (
                                <>
                                    {preciseTime(text.startDate)} - {preciseTime(text.endDate)}{' '}
                                </>
                            )}
                            {text.lesson && `第${text.lesson}节`}
                        </span>
                    );
                },
            },
            {
                title: '参与教师',
                key: 'teacherList',
                // width: '10%',
                render: function (text, record) {
                    return <span>{self.formatTeacher(text.teacherList)}</span>;
                },
            },
            {
                title: '参与学生',
                key: 'participantList',
                width: '16%',
                render: function (text, record) {
                    return (
                        <div>
                            <span>{self.formatTeacher(text.participantList)}</span>
                            <p style={{ color: '#4A6CFD' }}>
                                {text.activeStudentSeatNumberSuccess && '座位号已生成'}
                            </p>
                        </div>
                    );
                },
            },
            {
                title: '类型',
                key: 'type',
                width: '5%',
                render: function (text, record) {
                    return <span>{self.formatType(text.type)}</span>;
                },
            },
            {
                title: '地点',
                key: 'address',
                width: '5%',
                render: function (text, record) {
                    return <span>{text.place || text.outsidePlace}</span>;
                },
            },
            {
                title: '关联课程',
                key: 'relatedCourseId',
                width: '16%',
                render: (text, record) => {
                    return (
                        <span>
                            {locale() != 'en' ? text.relatedCourseName : text.relatedCourseEnName}
                        </span>
                    );
                },
            },
            {
                title: '公布状态',
                key: 'activeHavePublished',
                width: '7%',
                render: (text, record) => {
                    return text.activeHavePublished ? '已公布' : '未公布';
                },
            },
            {
                title: '操作',
                key: 'operation',
                width: '6%',
                render: (text, record) => (
                    <span>
                        <a className={styles.editBtn} onClick={this.editCourse.bind(this, record)}>
                            <i className={icon.iconfont + ' ' + styles.iconStyle}>&#xe6aa;</i>
                        </a>
                        <a>
                            <i
                                onClick={this.deleteCourse.bind(this, record.id, record.ifRepeated)}
                                className={icon.iconfont + ' ' + styles.iconStyle}
                            >
                                &#xe739;
                            </i>
                        </a>
                    </span>
                ),
            },
        ];
        return (
            <div className={styles.clubTableBox}>
                <Table
                    rowKey="id"
                    bordered
                    dataSource={clubDataSource}
                    columns={columns}
                    pagination={false}
                    rowSelection={rowSelection}
                />
                <Modal
                    visible={showModal}
                    title="删除排课结果"
                    onCancel={this.handleCancel}
                    footer={null}
                    width="400px"
                >
                    <div className={styles.deleteModalContent}>
                        <Radio.Group onChange={this.changeDeleteType} value={type}>
                            <Radio style={radioStyle} value={1}>
                                删除本次
                            </Radio>
                            {ifRepeated && (
                                <Radio style={radioStyle} value={2}>
                                    删除本次及以后所有课节活动
                                </Radio>
                            )}
                        </Radio.Group>
                    </div>
                    <div className={styles.operButtonList}>
                        <span
                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                            onClick={this.handleCancel}
                        >
                            取消
                        </span>
                        <span
                            className={styles.modalBtn + ' ' + styles.submitBtn}
                            onClick={this.handleOk}
                        >
                            确认删除
                        </span>
                    </div>
                </Modal>

                <Modal
                    visible={publish}
                    title="确认删除活动"
                    onCancel={this.handleCancel}
                    footer={null}
                    width="400px"
                >
                    {type == 1
                        ? '本次操作仅删除当前活动安排，若活动已公布，将同步删除日程'
                        : type == 2
                        ? `本次操作将删除本次及以后共${
                              accountCourseNum.amount || 0
                          }个活动安排，若活动已公布，将同步删除日程`
                        : ''}

                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Button
                            style={{ marginRight: '8px' }}
                            shape="round"
                            onClick={this.gbCancel}
                        >
                            放弃
                        </Button>
                        <Button type="primary" shape="round" onClick={this.gbOk}>
                            {ifpublish ? '保存并公布' : '确认删除'}
                        </Button>
                    </div>
                </Modal>
                {showEditCourse && (
                    <EditSystemCourse
                        {...this.state}
                        {...this.props}
                        hideSystemModal={this.hideSystemModal}
                    />
                )}
                {showEditFreedomCourse && (
                    <EditFreedomCourse
                        {...this.props}
                        {...this.state}
                        timeTableOrClub="club"
                        hideEditFreeModal={this.hideEditFreeModal}
                    />
                )}
            </div>
        );
    }
}
