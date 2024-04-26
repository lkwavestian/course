//复制排课结果
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, DatePicker, message, Table, Button } from 'antd';
import moment from 'moment';
import { formatTimeSafari } from '../../../../utils/utils';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
@connect((state) => ({
    byRangeTimeList: state.time.byRangeTimeList,
}))
export default class CopyResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',
            endTime: '',
            canClick: true,
            selectedRowKeys: [],
            selectedRows: [],
            selectDisable: false,
            isClick: true,
            btnText: '应用到所选周',
        };
    }

    componentDidMount() {}

    handleCancel = () => {
        const { hideModal } = this.props;
        this.setState({
            startTime: '',
            endTime: '',
        });
        typeof hideModal == 'function' && hideModal('copyResult');
    };

    handleOk = () => {
        const { dispatch, currentVersion, getVersionList, byRangeTimeList } = this.props;
        const { selectedRows, isClick, btnText } = this.state;

        if (isClick) {
            this.setState({
                isClick: false,
            });
            let arrPromise = [];
            let fetchLength = 0;
            if (this.state.canClick) {
                return;
            }
            if (!selectedRows || !selectedRows.length) {
                message.info('请勾选周期课表');
                return;
            }
            // 遍历逐个请求所选周版本
            selectedRows.map((item) => {
                /*   let start = new Date(item.startTime).getTime(),
                end = new Date(item.endTime).getTime(); */

                let start = moment(item.startTime).valueOf(),
                    end = moment(item.endTime).valueOf();
                byRangeTimeList.map((el) => {
                    if (el.startTime == item.startTime) {
                        this.setState(
                            {
                                [item.key]: 2, // 根据各个周的id控制处理状态：2处理中，3处理成功
                                canClick: true,
                            },
                            () => {
                                arrPromise.push(
                                    new Promise((resolve, reject) => {
                                        dispatch({
                                            type: 'timeTable/copyResult',
                                            payload: {
                                                id: currentVersion,
                                                startTime: start,
                                                endTime: end,
                                            },
                                            onSuccess: () => {
                                                console.log(
                                                    this.props.byRangeTimeList,
                                                    '?????byRangeTimeList'
                                                );
                                            },
                                        }).then(() => {
                                            this.setState({
                                                [item.key]: 3,
                                                btnText: '关闭',
                                                canClick: false,
                                            });
                                            typeof getVersionList == 'function' &&
                                                getVersionList.call(this);
                                            fetchLength += 1;
                                            resolve(fetchLength);
                                        });
                                    })
                                );
                            }
                        );
                    }
                    // return el;
                });
            });
            Promise.all(arrPromise).then((result) => {
                setTimeout(() => {
                    this.setState({
                        selectedRowKeys: [],
                        selectedRows: [],
                    });
                }, 300);
            });
            // this.setState({
            //     canClick:true
            // },()=>{
            // })
        }
        setTimeout(() => {
            this.setState({
                isClick: true,
            });
        }, 1000);
    };

    //修改时间
    changeTime = (value, dateString) => {
        this.setState(
            {
                startTime: dateString[0],
                endTime: dateString[1],
                canClick: false,
            },
            () => {
                this.getRangeTimeList();
            }
        );
    };

    // 查询周期内每周的当前课表
    getRangeTimeList = () => {
        const { dispatch, currentVersion } = this.props;
        let startTime = new Date(formatTimeSafari(this.state.startTime + ' 00:00:00')).getTime(),
            endTime = new Date(formatTimeSafari(this.state.endTime + ' 23:59:59')).getTime();
        let selectedRowKeysArr = [];
        let selectedRowsArr = [];
        dispatch({
            type: 'time/getByRangeTimeWeeklyCurrentVersion',
            payload: {
                startTime,
                endTime,
                weekVersionId: currentVersion,
            },
        }).then(() => {
            const { byRangeTimeList } = this.props;
            console.log(byRangeTimeList, 'byRangeTimeList+++++++');
            byRangeTimeList &&
                byRangeTimeList.length > 0 &&
                byRangeTimeList.map((item) => {
                    this.state[item.startTime] = 1;
                    item.key = item.startTime;
                    selectedRowKeysArr.push(item.startTime);
                    selectedRowsArr.push(item);
                });
            this.setState({
                selectedRowKeys: [...selectedRowKeysArr],
                selectedRows: [...selectedRowsArr],
            });
        });
    };

    selectedRowsChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
    };

    componentWillUnmount() {
        this.props.dispatch({
            type: 'time/clearData',
        });
    }

    render() {
        const { copyResultModal, byRangeTimeList } = this.props;
        const { selectedRowKeys, selectedRows, btnText } = this.state;
        let disabledStyle = this.state.canClick ? styles.btnDisabled : styles.btnCan;
        const columns = [
            {
                title: '周起止时间',
                dataIndex: 'time',
                key: 'time',
                render: (text, record) => {
                    let start = record.startTime.split(' ')[0];
                    let end = record.endTime.split(' ')[0];
                    return (
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {' '}
                            {start} 至 {end}{' '}
                        </span>
                    );
                },
            },
            {
                title: '当前课表',
                dataIndex: 'preSchedule',
                key: 'preSchedule',
                render: (text, record) => {
                    let publishedStyle = record.published === 1 ? styles.published : '';
                    return (
                        <span className={styles.preSchedule}>
                            <span className={styles.name}>
                                {record.name}
                                <span className={styles.status + '  ' + publishedStyle}>
                                    {record.published === 0
                                        ? ' 未公布'
                                        : record.published === 1
                                        ? ' 已公布'
                                        : record.published === 2
                                        ? ' 公布失败'
                                        : record.published === 3
                                        ? ' 公布中'
                                        : null}
                                </span>
                            </span>
                            {record.versionSourceId ? (
                                <span className={styles.originVersion}>
                                    来源版本：{record.versionSourceTime} {record.versionSourceName}{' '}
                                </span>
                            ) : (
                                <span>无</span>
                            )}
                        </span>
                    );
                },
            },
            {
                title: '',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return (
                        <span className={styles.status}>
                            {' '}
                            {record.fetchStatus == 2 ? (
                                '处理中'
                            ) : record.fetchStatus == 3 ? (
                                <span style={{ color: '#7fd14f' }}>处理成功</span>
                            ) : (
                                ''
                            )}{' '}
                        </span>
                    );
                },
            },
        ];
        const data = [];
        if (byRangeTimeList && byRangeTimeList.length > 0) {
            for (let i = 0; i < byRangeTimeList.length; i++) {
                data.push({
                    key: byRangeTimeList[i].startTime,
                    startTime: byRangeTimeList[i].startTime,
                    endTime: byRangeTimeList[i].endTime,
                    name: byRangeTimeList[i].name,
                    versionSourceName: byRangeTimeList[i].versionSourceName,
                    versionSourceId: byRangeTimeList[i].versionSourceId,
                    versionSourceTime: byRangeTimeList[i].versionSourceTime,
                    published: byRangeTimeList[i].published,
                    fetchStatus: this.state[byRangeTimeList[i].startTime],
                });
            }
        }

        const rowSelection = {
            selectedRowKeys,
            defaultSelectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                this.selectedRowsChange(selectedRowKeys, selectedRows);
            },
            getCheckboxProps: (record) => ({
                disabled: this.state.canClick, // Column configuration not to be checked
                name: record.name,
            }),
        };
        let handle = btnText == '关闭' ? this.handleCancel : this.handleOk;
        return (
            <Modal
                visible={copyResultModal}
                title="复制排课结果"
                onCancel={this.handleCancel}
                footer={null}
                className={styles.copyModal}
                width="640px"
                destroyOnClose={true}
            >
                <div className={styles.copyResultPicker}>
                    <span>将当前排课结果应用到：</span>
                    <RangePicker
                        style={{ width: 240 }}
                        allowClear={false}
                        format={dateFormat}
                        onChange={this.changeTime}
                        disabledDate={null}
                        disabled={false}
                    />
                </div>
                <div className={styles.scheduleList}>
                    {byRangeTimeList && byRangeTimeList.length > 0 ? (
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                        />
                    ) : null}
                </div>
                <div className={styles.operButtonList}>
                    {/* <span className={styles.modalBtn + ' ' + styles.cancelBtn} onClick={this.handleCancel}>取消</span> */}
                    <Button
                        className={styles.modalBtn + '  ' + styles.submitBtn + '  ' + disabledStyle}
                        onClick={handle}
                    >
                        {btnText}
                    </Button>
                </div>
            </Modal>
        );
    }
}
