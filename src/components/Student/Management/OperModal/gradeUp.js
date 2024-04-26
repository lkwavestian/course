// 升年级
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Spin, Button, Icon, Input } from 'antd';
import { trans, locale } from '../../../../utils/i18n';

@Form.create()
@connect((state) => ({
    orgCompletePath: state.teacher.orgCompletePath,
    upgradeInfo: state.student.upgradeInfo,
}))
class GradeUp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            upgradeInfo: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.gradeUpVisible != this.props.gradeUpVisible) {
            let { treeId } = this.props;
            if (nextProps.gradeUpVisible && treeId) {
                this.initUpgradeInfo(treeId);
                this.getPathByTreeId(treeId);
            }
        }
    }

    initUpgradeInfo(treeId) {
        const { dispatch } = this.props;
        this.setState({
            loading: false,
        });
        dispatch({
            type: 'student/upgradeInfo',
            payload: {
                nodeId: treeId,
            },
            onSuccess: () => {
                this.setState({
                    upgradeInfo: this.props.upgradeInfo,
                    loading: true,
                });
            },
        });
    }

    //根据树节点id获取路径
    getPathByTreeId(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getPathByTreeId',
            payload: {
                nodeId: id,
            },
            onSuccess: () => {},
        });
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'gradeUp');
        form.resetFields();
    };

    inputValueHTML(item, index) {
        return (
            <Fragment>
                <Input
                    className={styles.input}
                    defaultValue={item.newName}
                    onChange={this.changeValue.bind(this, index, 1)}
                />
                <Input
                    className={styles.input}
                    defaultValue={item.newEnName}
                    onChange={this.changeValue.bind(this, index, 2)}
                />
            </Fragment>
        );
    }

    changeValue = (index, type, ev) => {
        let { upgradeInfo } = this.state;
        let item = upgradeInfo[index];
        let name = type === 1 ? 'newName' : 'newEnName';
        item[name] = ev.target.value;
        this.setState({
            upgradeInfo,
        });
    };

    handleSubmit = () => {
        let { dispatch } = this.props;
        let { upgradeInfo } = this.state;
        let newUpgradeInfo = [];
        upgradeInfo.forEach((el) => {
            newUpgradeInfo.push({
                nodeId: el.treeNodeId,
                name: el.newName,
                enName: el.newEnName,
                newTeachingOrgId: el.newTeachingOrgId,
                newGrade: el.newGrade,
            });
        });
        dispatch({
            type: 'student/confirmUpgrade',
            payload: {
                nodeId: this.props.treeId,
                upgradeJson: JSON.stringify(newUpgradeInfo),
            },
            onSuccess: () => {
                this.handleCancel();
            },
        });
    };

    render() {
        let { gradeUpVisible, orgCompletePath } = this.props;
        let { loading, upgradeInfo } = this.state;
        return (
            <Modal
                visible={gradeUpVisible}
                title={trans('student.gradeUp', '升年级')}
                footer={null}
                onCancel={this.handleCancel}
            >
                <div className={styles.GradeUp}>
                    {loading ? (
                        <div>
                            <div className={styles.title}>
                                <span className={styles.m}>
                                    {trans('student.gradeUp.currentDian', '当前节点')}:
                                </span>
                                <span className={styles.t}>{orgCompletePath}</span>
                            </div>
                            <div className={styles.content}>
                                {upgradeInfo.length > 0 &&
                                    upgradeInfo.map((item, i) => (
                                        <Fragment key={i}>
                                            {locale() !== 'en' ? (
                                                <div className={styles.item}>
                                                    <span className={styles.l}>
                                                        <span
                                                            className={`${styles.t} ${styles.t1}`}
                                                        >
                                                            {item.oldTeachingOrgName}
                                                        </span>
                                                        <span className={styles.t}>
                                                            {item.oldName}
                                                        </span>
                                                    </span>
                                                    <span className={styles.m}>
                                                        <Icon type="arrow-right" />
                                                    </span>
                                                    <span className={styles.r}>
                                                        <span className={styles.t}>
                                                            {item.newTeachingOrgName}{' '}
                                                        </span>
                                                        {this.inputValueHTML(item, i)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className={styles.item}>
                                                    <span className={styles.l}>
                                                        <span
                                                            className={`${styles.t} ${styles.t1}`}
                                                        >
                                                            {item.oldTeachingOrgEnName}
                                                        </span>
                                                        <span className={styles.t}>
                                                            {item.newName}
                                                        </span>
                                                    </span>
                                                    <span className={styles.m}>
                                                        <Icon type="arrow-right" />
                                                    </span>
                                                    <span className={styles.r}>
                                                        <span className={styles.t}>
                                                            {item.newTeachingOrgName}
                                                        </span>
                                                        {this.inputValueHTML(item, i)}
                                                    </span>
                                                </div>
                                            )}
                                        </Fragment>
                                    ))}
                            </div>
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
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', height: '120px', lineHeight: '120px' }}>
                            <Spin />
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

export default GradeUp;
