import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Button, Table, Spin, Pagination } from 'antd';
import { trans } from '../../../../utils/i18n';
import { mockForm } from '../../../../utils/utils';

function ExportStudentSource(props) {
    const { exportListVisible, dispatch, downloadStuList } = props;
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        getDownloadList();
    }, []);

    useEffect(() => {
        // if (pageNum != 1) {
            getDownloadList();
        // }
    }, [pageNum]);

    useEffect(() => {
        // if (pageSize) {
            getDownloadList();
        // }
    }, [pageSize]);

    const getDownloadList = () => {
        setLoading(true);
        dispatch({
            type: 'student/downloadList',
            payload: {
                pageNum: pageNum,
                pageSize: pageSize,
            },
        }).then(() => {
            setLoading(false);
        });
    };

    const changePage = (page, pageSize) => {
        setPageNum(page);
    };

    const changeSize = (current, size) => {
        setPageSize(size);
    };

    const columns = [
        {
            title: '文件名',
            dataIndex: 'titleName',
            key: 'titleName',
            align: 'center',
        },
        {
            title: '操作人',
            dataIndex: 'operatorName',
            key: 'operatorName',
            align: 'center',
        },
        {
            title: '导出时间',
            dataIndex: 'exportTime',
            key: 'exportTime',
            align: 'center',
        },
        {
            title: '当前状态',
            dataIndex: 'processState',
            key: 'processState',
            align: 'center',
            render: (text, record) => {
                if (record.processState == 2) {
                    return '正在导出中，请稍后';
                } else if (record.processState == 1) {
                    return '导出成功';
                } else if (record.processState == 0) {
                    return '导出失败';
                }
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                if (record.processState == 2) {
                    return <a onClick={getDownloadList}>刷新</a>;
                } else if (record.processState == 1) {
                    return (
                        <a
                            className={styles.uploadBtn}
                            href={`/api/teaching/history/export/downloadHistoryExportFile?id=${record.id}`}
                            target="_self"
                        >
                            下载
                        </a>
                    );
                }
            },
        },
    ];
    return (
        <Modal
            visible={exportListVisible}
            title={'下载导出数据'}
            width="670px"
            onCancel={props.closeDownload}
            className={styles.downloadStyles}
            footer={
                <div>
                    <Button style={{ margin: '0 10px 0 27%' }} onClick={props.closeDownload}>
                        关闭页面
                    </Button>
                    <span>关闭后可以再次打开文件列表，下载已经触发过的导出文件</span>
                </div>
            }
        >
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={
                        downloadStuList && downloadStuList.data && downloadStuList.data.length > 0
                            ? downloadStuList.data
                            : []
                    }
                    pagination={false}
                    scroll={{ y: 400 }}
                />
                <div>仅支持下载一年内的导出数据</div>

                <Pagination
                    style={{ display: 'flex', justifyContent: 'end' }}
                    current={pageNum}
                    pageSize={pageSize}
                    onChange={changePage}
                    onShowSizeChange={changeSize}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50', '100']}
                    total={
                        downloadStuList && downloadStuList.total && downloadStuList.total > 0
                            ? downloadStuList.total
                            : 0
                    }
                ></Pagination>
            </Spin>
        </Modal>
    );
}

function mapStateProps(state) {
    return {
        downloadStuList: state.student.downloadStuList,
    };
}
export default connect(mapStateProps)(ExportStudentSource);
