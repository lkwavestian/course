//转移学生
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Input, Button } from 'antd';
import { trans } from '../../../../utils/i18n';

@Form.create()
@connect((state) => ({}))
class LeftSchool extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            transfer: this.props.record.transfer || null,
        };
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'leftSchool');
        form.resetFields();
    };

    handleSubmit = () => {
        let { dispatch } = this.props;
        dispatch({
            type: 'student/leftSchoolReason',
            payload: {
                userId: this.props.record.userId,
                transfer: this.state.transfer,
            },
            onSuccess: () => {
                this.handleCancel();
                const { getStudentList } = this.props;
                typeof getStudentList == 'function' && getStudentList.call(this);
            },
        });
    };

    render() {
        let { leftSchoolVisible } = this.props;
        let { transfer } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };

        return (
            <Modal
                visible={leftSchoolVisible}
                title={trans('leftSchool', '设置离校去向')}
                footer={null}
                onCancel={this.handleCancel}
            >
                <div className={styles.TransferSchool}>
                    <Form {...formItemLayout}>
                        <Form.Item label={trans('student.departure-from-school', '离校去向')}>
                            <Input
                                defaultValue={transfer || null}
                                onChange={(e) => {
                                    this.setState({
                                        transfer: e.target.value,
                                    });
                                }}
                                placeholder={trans('leftSchool', '设置离校去向')}
                                className={styles.enterSchool}
                            />
                        </Form.Item>
                        <Form.Item>
                            <div className={styles.btnBox}>
                                <Button onClick={this.handleCancel} className={styles.btn}>
                                    {trans('global.cancel', '取消')}
                                </Button>
                                <Button
                                    onClick={this.handleSubmit}
                                    type="primary"
                                    className={styles.btn}
                                >
                                    {trans('global.confirm', '确定')}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default LeftSchool;
