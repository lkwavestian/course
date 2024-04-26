//一键排课
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import {
    Modal,
    Radio,
    message,
    Progress,
    Checkbox,
    Icon,
    Button,
    Spin,
    Select,
    Form,
    Row,
    Col,
} from 'antd';
import icon from '../../../../icon.less';
import { trans } from '../../../../utils/i18n';
import { isEmpty } from 'lodash';

let timeInterval;

@connect((state) => ({
    clickKeuScheduleList: state.timeTable.clickKeuScheduleList,
    fetchScheduleMessage: state.timeTable.fetchScheduleMessage,
    fetProgress: state.timeTable.fetProgress,
    fetDownLoadUrl: state.timeTable.fetDownLoadUrl,
    fetFileDTO: state.timeTable.fetFileDTO,
}))
@Form.create()
export default class ClickKeyArrange extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showProgressModal: false,
            ifUseShellFet: false,
            showErrorMessage: false, //展示排课错误提示
            showDetails: false, //展示详情
            fetProgressContent: {},
            showLoadingBtn: false, //是否展示loading button
            fetDownLoadUrl: '',
            stopFetCourseStatus: false,
        };
    }

    componentDidMount() {
        this.getScheduleList();
    }

    handleCancel = () => {
        const {
            hideModal,
            form: { setFieldsValue },
        } = this.props;
        typeof hideModal == 'function' && hideModal('clickKey');
        setFieldsValue({
            scheduleId: '',
            gradeIdList: [],
        });
        this.setState({
            ifUseShellFet: false,
            showErrorMessage: false,
            showDetails: false,
            fetDownLoadUrl: '',
            stopFetCourseStatus: false,
        });
    };

    handleOk = () => {
        const {
            dispatch,
            form: { getFieldsValue },
            currentVersion,
            fetchScheduleList,
            fetchCourseList,
            getshowAcCourseList,
        } = this.props;
        const { ifUseShellFet } = this.state;
        let { scheduleId, gradeIdList } = getFieldsValue();
        let self = this;
        if (scheduleId == '') {
            message.info('请先选择作息~');
            return false;
        }
        if (isEmpty(gradeIdList)) {
            message.info('请先选择年级~');
            return false;
        }
        let callbackFn = () => {
            const { fetFileDTO } = this.props;
            this.setState(
                {
                    showProgressModal: true,
                },
                () => {
                    timeInterval = setInterval(self.getFetProgress, 1000);
                }
            );
            dispatch({
                type: 'timeTable/fetSchedule',
                payload: {
                    versionId: currentVersion,
                    scheduleId,
                    ifUseShellFet: ifUseShellFet,
                    gradeIdList,
                    fetFileDTO,
                },
                onSuccess: () => {
                    this.setState(
                        {
                            showProgressModal: false,
                            fetProgressContent: {},
                            showLoadingBtn: false,
                            fetDownLoadUrl: '',
                            stopFetCourseStatus: false,
                        },
                        () => {
                            clearInterval(timeInterval);
                            timeInterval = undefined;
                        }
                    );
                    message.success('排课完成');

                    typeof fetchScheduleList == 'function' && fetchScheduleList.call(this);
                    typeof fetchCourseList == 'function' && fetchCourseList.call(this);
                    typeof getshowAcCourseList == 'function' && getshowAcCourseList.call(this);
                    this.handleCancel();
                },
                onError: () => {
                    this.setState(
                        {
                            showProgressModal: false,
                            fetProgressContent: {},
                            showErrorMessage: true,
                            showLoadingBtn: false,
                            fetDownLoadUrl: '',
                            stopFetCourseStatus: false,
                        },
                        () => {
                            clearInterval(timeInterval);
                            timeInterval = undefined;
                        }
                    );
                },
            });
        };
        this.setState({
            showLoadingBtn: true,
        });
        this.handleDownloadData(callbackFn);
    };

    //获取一键排课列表
    getScheduleList() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/getClickKeySchedule',
            payload: {
                versionId: currentVersion,
            },
        }).then(() => {
            const {
                clickKeuScheduleList,
                form: { setFieldsValue },
            } = this.props;
            setFieldsValue({
                scheduleId: clickKeuScheduleList[0]?.scheduleId,
                gradeIdList: clickKeuScheduleList[0]?.gradeList.map((item) => item.id),
            });
        });
    }

    //格式化年级
    formatClass(arr) {
        if (!arr || arr.length == 0) return;
        return arr.map((el) => {
            return (
                <em key={el.id} className={styles.clickKeyClass}>
                    {el.name}
                </em>
            );
        });
    }

    //是否使用shell fet排课
    changeFet = (e) => {
        this.setState({
            ifUseShellFet: e.target.checked,
        });
    };

    //查看详情
    lookDetail = () => {
        this.setState({
            showDetails: !this.state.showDetails,
        });
    };

    haveKnow = () => {
        this.setState({
            showErrorMessage: false,
            showDetails: false,
        });
    };

    //fet进程查询
    getFetProgress = () => {
        const { dispatch } = this.props;
        const { fetProgressContent } = this.state;
        dispatch({
            type: 'timeTable/getFetProgress',
            payload: {},
            onSuccess: () => {
                const { fetProgress } = this.props;
                if (fetProgressContent && fetProgressContent.all && fetProgress.all === 0) {
                    return;
                } else {
                    this.setState({
                        fetProgressContent: fetProgress,
                    });
                }
            },
        });
    };

    //终止排课
    stopFetCourse = () => {
        const { dispatch, currentVersion } = this.props;

        this.setState({
            stopFetCourseStatus: true,
        });

        dispatch({
            type: 'timeTable/stopFetCourse',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                console.log('this.state :>> ', this.state);
                this.setState({
                    showProgressModal: false,
                    showErrorMessage: false,
                    fetDownLoadUrl: '',
                    showLoadingBtn: false,
                });
                clearInterval(timeInterval);
                timeInterval = undefined;
            },
        });
    };

    handleDownloadData = (callbackFn) => {
        const {
            dispatch,
            currentVersion,
            form: { getFieldsValue },
        } = this.props;
        const { ifUseShellFet } = this.state;
        const { scheduleId, gradeIdList } = getFieldsValue();
        return dispatch({
            type: 'timeTable/downloadFetSchedule',
            payload: {
                versionId: currentVersion,
                scheduleId: scheduleId,
                ifUseShellFet: ifUseShellFet,
                gradeIdList,
            },
            onSuccess: () => {
                const { fetDownLoadUrl } = this.props;
                console.log('fetDownLoadUrl :>> ', fetDownLoadUrl);
                this.setState(
                    {
                        fetDownLoadUrl,
                    },
                    () => {
                        callbackFn && callbackFn();
                    }
                );
            },
            onError: () => {
                this.setState({
                    showLoadingBtn: false,
                });
            },
        });
    };

    clickDownloadData = () => {
        const { fetDownLoadUrl } = this.props;
        window.open(fetDownLoadUrl);
    };

    scheduleIdChange = (value) => {
        console.log('value :>> ', value);
        const {
            clickKeuScheduleList,
            form: { setFieldsValue },
        } = this.props;
        let targetSchedule = clickKeuScheduleList.find((item) => item.scheduleId === value);
        setFieldsValue({
            gradeIdList: targetSchedule?.gradeList.map((item) => item.id),
        });
    };

    render() {
        const {
            clickKeyModal,
            clickKeuScheduleList,
            fetchScheduleMessage,
            form: { getFieldDecorator, setFieldsValue, getFieldValue },
        } = this.props;
        const {
            showProgressModal,
            showErrorMessage,
            showDetails,
            fetProgressContent,
            showLoadingBtn,
            fetDownLoadUrl,
            stopFetCourseStatus,
        } = this.state;

        const formItemLayout = {
            labelCol: {
                sm: { span: 6 },
            },
            wrapperCol: {
                sm: { span: 18 },
            },
        };

        let targetSchedule = clickKeuScheduleList.find(
            (item) => item.scheduleId === getFieldValue('scheduleId')
        );
        return (
            <div>
                <Modal
                    visible={clickKeyModal}
                    title={trans('global.scheduling range', '选择排课范围')}
                    onCancel={this.handleCancel}
                    footer={null}
                    className={styles.scheduleRange}
                >
                    <Spin tip="排课终止中..." spinning={stopFetCourseStatus}>
                        <div className={styles.clickKeyContent}>
                            <Form {...formItemLayout}>
                                <Form.Item label="选择作息">
                                    {getFieldDecorator('scheduleId', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '必须选择学期',
                                            },
                                        ],
                                    })(
                                        <Select
                                            style={{ width: 300 }}
                                            onChange={this.scheduleIdChange}
                                        >
                                            {clickKeuScheduleList.map((item) => (
                                                <Select.Option value={item.scheduleId}>
                                                    {item.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="年级范围">
                                    {getFieldDecorator('gradeIdList', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '必须选择年级',
                                            },
                                        ],
                                    })(
                                        <Checkbox.Group>
                                            {/* <Row> */}
                                            {getFieldValue('scheduleId') &&
                                                targetSchedule?.gradeList.map((item) => (
                                                    // <Col span={8}>
                                                    <Checkbox value={item.id}>{item.name}</Checkbox>
                                                    // </Col>
                                                ))}
                                            {/* </Row> */}
                                        </Checkbox.Group>
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                        <div className={styles.operButtonList}>
                            <span /* className={styles.fetCourseStyle} */>
                                <Checkbox onChange={this.changeFet}>
                                    <em>{trans('global. Shell mode', 'shell 排课')}</em>
                                </Checkbox>
                            </span>
                            <Button
                                style={{ margin: '0 8px' }}
                                /* className={styles.modalBtn + ' ' + styles.cancelBtn} */
                                onClick={this.handleCancel}
                            >
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button type="primary" onClick={this.handleOk} loading={showLoadingBtn}>
                                {trans('global.Generate', '排课')}
                            </Button>
                        </div>
                    </Spin>
                </Modal>

                <Modal
                    visible={showProgressModal}
                    // visible={true}
                    footer={null}
                    title="生成排课结果"
                    width="520px"
                >
                    <div className={styles.progressContent}>
                        <p className={styles.downLoadFetch}>
                            <span className={styles.label}>①初始化排课数据</span>
                            {fetDownLoadUrl ? (
                                <a className={styles.downLoadData} onClick={this.clickDownloadData}>
                                    下载排课数据
                                </a>
                            ) : (
                                ''
                            )}
                        </p>
                        <p className={styles.progressTips}>
                            <span>②正在生成排课结果</span>
                            <span className={styles.progressData}>
                                ({fetProgressContent.progressNum || 0}/{fetProgressContent.all || 0}{' '}
                                进度{parseInt(fetProgressContent.percent || 0, 10)}%)...
                            </span>
                        </p>
                        <Progress
                            strokeColor={{
                                from: '#108ee9',
                                to: '#87d068',
                            }}
                            percent={parseInt(fetProgressContent.percent || 0, 10)}
                            status="active"
                        />
                        <div className={styles.operButtonStyle}>
                            <span onClick={this.stopFetCourse}>终止排课</span>
                        </div>
                    </div>
                </Modal>
                <Modal
                    visible={showErrorMessage}
                    title="排课失败"
                    width="650px"
                    onCancel={this.haveKnow}
                    wrapClassName={styles.errMsgModal}
                    footer={[
                        <div className={styles.footerWrapper}>
                            <span className={styles.downLoadUrl}>
                                <a
                                    href={
                                        fetchScheduleMessage &&
                                        fetchScheduleMessage.content &&
                                        fetchScheduleMessage.content.downLoadUrl
                                    }
                                >
                                    下载
                                </a>
                            </span>

                            <Button
                                key="submit"
                                type="primary"
                                className={styles.adjustment}
                                onClick={this.haveKnow}
                            >
                                去调整
                            </Button>
                        </div>,
                    ]}
                >
                    <div className={styles.errorPage}>
                        <div className={styles.ruleMessage}>
                            {fetchScheduleMessage &&
                                fetchScheduleMessage.content &&
                                fetchScheduleMessage.content.fetMessage}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
