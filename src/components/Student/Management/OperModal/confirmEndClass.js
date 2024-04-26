//设置节点下的所有班级结班
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, message } from 'antd';
import { trans } from '../../../../utils/i18n';

function ConfirmEndClass(props) {
    useEffect(() => {
        if (props.confirmEndClassVisible === true) {
            getEndClassNumber();
        }
    }, [props.confirmEndClassVisible]);

    //获取结班操作的班级数量
    const getEndClassNumber = () => {
        const { dispatch, treeId } = props;
        dispatch({
            type: 'student/getEndClassNumber',
            payload: {
                nodeId: treeId,
            },
        });
    };

    //取消
    const handleCancel = () => {
        const { hideModal } = props;
        typeof hideModal == 'function' && hideModal.call(this, 'endClass');
    };

    //确定
    const confirm = () => {
        const { dispatch, treeId } = props;
        dispatch({
            type: 'student/confirmEndClass',
            payload: {
                nodeId: treeId,
            },
            onSuccess: () => {
                handleCancel();
                //更新树结构
                const { getTreeOrg } = props;
                typeof getTreeOrg == 'function' && getTreeOrg.call(this);
            },
        });
    };

    const { confirmEndClassVisible, endClassCount } = props;
    return (
        <Modal
            visible={confirmEndClassVisible}
            title={trans('global.warmTips', '温馨提示')}
            footer={null}
            width="450px"
            onCancel={handleCancel}
        >
            <div className={styles.confirmEndClassModal}>
                <p className={styles.confirmTips}>
                    {trans('student.confirmEndClass', '确认将该节点下{$num}个班级结班吗？', {
                        num: endClassCount || 0,
                    })}
                </p>
            </div>
            <div className={styles.operationList}>
                <a style={{ textAlign: 'center' }}>
                    <span
                        className={styles.modalBtn + ' ' + styles.cancelBtn}
                        onClick={handleCancel}
                    >
                        {trans('global.cancel', '取消')}
                    </span>
                    {endClassCount == 0 ? (
                        <span className={styles.modalBtn + ' ' + styles.grayBtn}>
                            {trans('global.confirm', '确定')}
                        </span>
                    ) : (
                        <span
                            className={styles.modalBtn + ' ' + styles.submitBtn}
                            onClick={confirm}
                        >
                            {trans('global.confirm', '确定')}
                        </span>
                    )}
                </a>
            </div>
        </Modal>
    );
}

function mapStateProps(state) {
    return {
        endClassCount: state.student.endClassCount,
    };
}

export default connect(mapStateProps)(ConfirmEndClass);
