//版本对比
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Select, DatePicker, Button, Icon } from 'antd';
import { formatTimeSafari } from '../../../../utils/utils';
const { Option } = Select;

@connect((state) => ({
    compareVersion: state.timeTable.compareVersion,
    versionGrade: state.timeTable.versionGrade,
}))
export default class VersionComparison extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date().getTime(),
            currentDate1: 0,
            startTime: 0,
            endTime: 0,
            startTimeTwo: 0,
            endTimeTwo: 0,
            newVersionList: [],
            oldVersionList: [],
            currentVersionId: undefined,
            chooseVersionId: undefined,
            oldVersionListName: undefined,
            newVersionListName: undefined,
            changeGradeName: undefined,
            handleOk: '开始对比',
            button: true,
            connectval: false,
        };
    }

    changeDatePicker = (date, dateString) => {
        let str = dateString.replace(/-/g, '/');
        let dateChange = new Date(str).getTime();
        this.setState(
            {
                currentDate: dateChange,
            },
            () => {
                this.getCurrentWeek(this.state.currentDate, 1);
            }
        );
    };
    changeDatePicker1 = (date, dateString) => {
        let str = dateString.replace(/-/g, '/');
        let dateChange = new Date(str).getTime();
        this.setState(
            {
                currentDate1: dateChange,
            },
            () => {
                this.getCurrentWeek(this.state.currentDate1, 2);
            }
        );
    };
    getCurrentWeek(nowTime, style) {
        let now = new Date(formatTimeSafari(nowTime)),
            nowStr = now.getTime(),
            day = now.getDay() != 0 ? now.getDay() : 7,
            oneDayLong = 24 * 60 * 60 * 1000;
        let MondayTime = nowStr - (day - 1) * oneDayLong,
            SundayTime = nowStr + (7 - day) * oneDayLong;
        let monday = new Date(formatTimeSafari(MondayTime)).getTime(),
            sunday = new Date(formatTimeSafari(SundayTime)).getTime();
        this.getAlldayTime(monday, sunday, style);
    }
    getAlldayTime(start, end, style) {
        let currentDayStart = this.getLocalTime(new Date(formatTimeSafari(start)), 2);
        let currentDayEnd = this.getLocalTime(new Date(formatTimeSafari(end)), 2);
        let startTime = new Date(formatTimeSafari(currentDayStart + ' ' + '00:00:00')).getTime();
        let endTime = new Date(formatTimeSafari(currentDayEnd + ' ' + '23:59:59')).getTime();
        if (style == 1) {
            this.setState(
                {
                    endTime: endTime,
                    startTime: startTime,
                },
                () => {
                    //查询周版本列表
                    this.getVersionList();
                }
            );
        } else if (style == 2) {
            this.setState(
                {
                    startTimeTwo: startTime,
                    endTimeTwo: endTime,
                },
                () => {
                    //查询周版本列表
                    this.getVersionList1();
                }
            );
        }
    }
    getVersionList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getVersionList',
            payload: {
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                gradeIdList: this.state.gradeValue,
            },
        }).then(() => {
            const { versionList } = this.props;
            this.setState({
                oldVersionList: versionList,
            });
        });
    };
    getVersionList1 = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getVersionList',
            payload: {
                startTime: this.state.startTimeTwo,
                endTime: this.state.endTimeTwo,
                gradeIdList: this.state.gradeValue,
            },
        }).then(() => {
            const { versionList } = this.props;
            this.setState({
                newVersionList: versionList,
            });
        });
    };
    getLocalTime(time, type) {
        if (!time) return false;
        var time = new Date(formatTimeSafari(time)),
            y = time.getFullYear(),
            m = time.getMonth() + 1,
            day = time.getDate();
        if (type == 1) {
            return y + '年' + m + '月' + day + '日';
        }
        if (type == 2) {
            return y + '/' + m + '/' + day;
        }
        if (type == 3) {
            return m + '月' + day + '日';
        }
    }
    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal('versionComparison');
        // this.clearProps();
        this.setState({
            currentDate: new Date().getTime(),
            currentDate1: 0,
            startTime: 0,
            endTime: 0,
            startTimeTwo: 0,
            endTimeTwo: 0,
            newVersionList: [],
            oldVersionList: [],
            currentVersionId: undefined,
            chooseVersionId: undefined,
            oldVersionListName: undefined,
            newVersionListName: undefined,
            changeGradeName: undefined,
            children: undefined,
            compareVersionIf: false,
            connectval: false,
            handleOk: '开始对比',
        });
    };
    oldVersionListId = (value, event) => {
        const { dispatch } = this.props;
        this.setState({
            currentVersionId: value,
            oldVersionListName: event.props.children,
            connectval: false,
            changeGradeName: undefined,
        });

        dispatch({
            type: 'timeTable/versionGrade',
            payload: {
                versionId: value,
            },
            onSuccess: () => {
                typeof getVersionList == 'function' && getVersionList.call(this);
            },
        });
    };
    newVersionListId = (value, event) => {
        this.setState({
            chooseVersionId: value,
            connectval: false,
            newVersionListName: event.props.children,
        });
    };
    changeGrade = (value) => {
        // const { dispatch} = this.props;
        // const {currentVersionId,chooseVersionId} = this.state
        // this.data.abort()
        this.setState({
            connectval: false,
            changeGradeName: value.length == 0 ? undefined : value,
        });
        // this.clearProps();
        // dispatch({
        //     type: 'timeTable/compareVersion',
        //     payload: {
        //         currentVersionId,
        //         chooseVersionId,
        //         gradeIds:value,
        //     }, onSuccess: () => {
        //         typeof getVersionList == "function" && getVersionList.call(this);
        //     }
        // })
    };
    // clearProps() {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'timeTable/clearProps',
    //         payload: {}
    //     })
    // }
    handleOk = () => {
        const { dispatch } = this.props;
        const { currentVersionId, chooseVersionId, changeGradeName } = this.state;
        this.setState({
            handleOk: '对比进行中',
            button: false,
        });
        dispatch({
            type: 'timeTable/compareVersion',
            payload: {
                currentVersionId,
                chooseVersionId,
                gradeIds: changeGradeName,
            },
            onSuccess: () => {
                typeof getVersionList == 'function' && getVersionList.call(this);
            },
        }).then(() => {
            this.setState({
                handleOk: '开始对比',
                compareVersionIf: true,
                button: true,
                connectval: true,
            });
        });
    };
    render() {
        const { versionComparisonModal, versionGrade, compareVersion } = this.props;
        const {
            startTime,
            endTime,
            startTimeTwo,
            endTimeTwo,
            newVersionList,
            oldVersionList,
            oldVersionListName,
            newVersionListName,
            changeGradeName,
            handleOk,
            button,
            connectval,
            compareVersionIf,
        } = this.state;
        let weekStart = this.getLocalTime(startTime, 2),
            weekEnd = this.getLocalTime(endTime, 2),
            weekStartTwo = this.getLocalTime(startTimeTwo, 2),
            weekEndTwo = this.getLocalTime(endTimeTwo, 2);
        return (
            <Modal
                visible={versionComparisonModal}
                title="版本差异对比"
                onCancel={this.handleCancel}
                footer={null}
                width="980px"
            >
                <div style={{ minHeight: '260px' }}>
                    <div>
                        <h3 style={{ display: 'inline-block', marginRight: '20px' }}>
                            选择要对比的版本
                        </h3>
                        <Icon type="info-circle" theme="twoTone" twoToneColor="#eeb020" />
                        <span className={styles.changeRadioAlert}>
                            目前仅支持系统排课结果对比，且不包含按时间方式预排的课程
                        </span>
                    </div>
                    <div className={styles.versionConent}>
                        <div className={styles.versionConentSpan}>版本1:</div>
                        <div className={styles.versionConentDatePicker}>
                            <span>{weekStart ? weekStart + '-' + weekEnd : '请选择时间'}</span>
                            <DatePicker
                                onChange={this.changeDatePicker}
                                style={{ width: 224, border: 'none' }}
                                className={styles.dateStyle}
                                placeholder=""
                                allowClear={false}
                            />
                        </div>
                        <Select
                            placeholder="请选择版本"
                            value={oldVersionListName}
                            style={{ width: '228px' }}
                            onChange={this.oldVersionListId}
                        >
                            {oldVersionList &&
                                oldVersionList.length > 0 &&
                                oldVersionList.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                    <div className={styles.versionConent}>
                        <div className={styles.versionConentSpan}>版本2:</div>
                        <div className={styles.versionConentDatePicker}>
                            <span>
                                {weekStartTwo ? weekStartTwo + '-' + weekEndTwo : '请选择时间'}
                            </span>
                            <DatePicker
                                onChange={this.changeDatePicker1}
                                style={{ width: 224, border: 'none' }}
                                className={styles.dateStyle}
                                placeholder=""
                                allowClear={false}
                            />
                        </div>
                        <Select
                            placeholder="请选择版本"
                            value={newVersionListName}
                            style={{ width: '228px' }}
                            onChange={this.newVersionListId}
                        >
                            {newVersionList &&
                                newVersionList.length > 0 &&
                                newVersionList.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                    <div className={styles.versionConent}>
                        <div className={styles.versionConentSpan}>对比年级:</div>
                        <Select
                            mode="multiple"
                            placeholder="全部年级"
                            value={changeGradeName}
                            style={{ width: '228px' }}
                            onChange={this.changeGrade}
                        >
                            {versionGrade &&
                                versionGrade.length > 0 &&
                                versionGrade.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.orgName}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                    <Button
                        loading={!button}
                        size="large"
                        type="primary"
                        shape="round"
                        disabled={oldVersionListName && newVersionListName ? false : true}
                        style={{ marginLeft: '644px', color: '#f5f5f5', background: '#fff' }}
                        onClick={this.handleOk}
                    >
                        {handleOk}
                    </Button>
                    {connectval ? (
                        <div>
                            <h3 className={styles.versionHerder}>
                                {compareVersion.length == 0 && compareVersionIf
                                    ? '对比完成，未找到两个版本的排课结果差异'
                                    : '对比完成差异结果如下:'}
                            </h3>
                            <div>
                                {compareVersion.length == 0 && compareVersionIf ? (
                                    ''
                                ) : (
                                    <div>
                                        <span className={styles.titleSpan}>
                                            {oldVersionListName}
                                        </span>
                                        <span className={styles.titleSpan}>
                                            {newVersionListName}
                                        </span>
                                    </div>
                                )}
                                <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                                    {compareVersion &&
                                        compareVersion.length > 0 &&
                                        compareVersion.map((item, index) => {
                                            return (
                                                <div>
                                                    <h4 key={index}>{item.studentGroup.name}</h4>
                                                    <span>
                                                        {item.compareModelList.map(
                                                            (item, index) => {
                                                                return (
                                                                    <div>
                                                                        <span
                                                                            className={
                                                                                styles.contrastList
                                                                            }
                                                                        >
                                                                            {item.currentResult}
                                                                        </span>
                                                                        <span
                                                                            className={
                                                                                styles.contrastList
                                                                            }
                                                                        >
                                                                            {item.chooseResult}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            <div className={styles.operBtn}>
                                <span
                                    className={styles.modalBtn + ' ' + styles.cancelBtn}
                                    onClick={this.handleCancel}
                                >
                                    我知道了
                                </span>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </Modal>
        );
    }
}
