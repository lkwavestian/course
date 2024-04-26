//学生管理--添加学生
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Tree, message } from 'antd';
import FetchPersonByOrg from '../../../fetchPersonByOrg/index';
import { trans } from '../../../../utils/i18n';

const { TreeNode } = Tree;

@Form.create()
@connect((state) => ({}))
export default class AddStudent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectStudentIds: [],
        };
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'addStudent');
    };

    handleOk = (e) => {
        e.preventDefault();
        const { dispatch, treeId } = this.props;
        const { selectStudentIds } = this.state;
        if (selectStudentIds.length == 0) {
        }
        dispatch({
            type: 'teacher/addStaff',
            payload: {
                nodeId: treeId,
                userIdList: this.getSelectIds(selectStudentIds),
            },
            onSuccess: () => {
                const { getStudentList } = this.props;
                typeof getStudentList == 'function' && getStudentList.call(this);
                this.handleCancel();
            },
        });
    };

    //统计选中学生的id&&name
    countStudentIds = (ids) => {
        this.setState({
            selectStudentIds: ids,
        });
    };

    //选中学生的id集合
    getSelectIds = (arr) => {
        let ids = [];
        arr.map((item) => {
            ids.push(Number(item.id));
        });
        return ids;
    };

    render() {
        const {
            addStudentVisible,
            tagCode,
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div>
                <Modal
                    visible={addStudentVisible}
                    footer={null}
                    title={trans('student.addStudent', '添加学生')}
                    width="650px"
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Form.Item>
                            <FetchPersonByOrg
                                {...this.props}
                                countStudentIds={this.countStudentIds}
                            />
                        </Form.Item>
                        <div className={styles.operationList}>
                            <a>
                                <span
                                    className={styles.modalBtn + ' ' + styles.cancelBtn}
                                    onClick={this.handleCancel}
                                >
                                    {trans('global.cancel', '取消')}
                                </span>
                                <span
                                    className={styles.modalBtn + ' ' + styles.submitBtn}
                                    onClick={this.handleOk}
                                >
                                    {trans('global.confirmAdd', '确认添加')}
                                </span>
                            </a>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}
