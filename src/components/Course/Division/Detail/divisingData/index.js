import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Button, Input, Modal, Checkbox, Radio, message, Table, Icon } from 'antd';

@Form.create()
@connect((state) => ({}))
export default class DivisingData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            distribution: [],
            ModalText: '',
            visible: false,
            loading: false,
            value: 1,
            submitValue: '启动系统分班',
            minQuantity: '',
            maxQuantity: '',
            divisionType: '1',
            numberOfShifts: '',
            changeWalkingClassPosition: '',
            changeWalkingClassCount: '',
            iconModalVisible: false,
        };
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            submitValue: '系统分班中。。。',
            loading: true,
        });
        setTimeout(() => {
            this.setState(
                {
                    visible: false,
                    loading: false,
                    submitValue: '启动系统分班',
                },
                () => {
                    message.success('分班成功');
                    this.props.changeCurrent();
                }
            );
        }, 2000);
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    iconHandleOk = () => {
        this.setState({
            iconModalVisible: false,
        });
    };

    iconHandleCancel = () => {
        this.setState({
            iconModalVisible: false,
        });
    };

    onChangeType = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    onChange = (checkedValues) => {
        this.setState({
            divisionType: checkedValues,
        });
    };

    changeMin = (e) => {
        console.log('e.target.value', e.target.value);
        this.setState({
            minQuantity: e.target.value,
        });
        // .then(() => {
        //     console.log('minQuantity', minQuantity);
        // });
    };
    changeMax = (e) => {
        this.setState({
            maxQuantity: e.target.value,
        });
    };
    changeNumber = (e, key) => {
        console.log('key aaaaaaa', key);
        console.log('e', e);
        this.setState(
            {
                numberOfShifts: e.target.value,
            },
            () => {
                console.log('numberOfShifts', this.state.numberOfShifts);
            }
        );
    };
    changeWalkingClassPosition = (e) => {
        this.setState({
            changeWalkingClassPosition: e.target.value,
        });
    };
    changeCount = (e) => {
        this.setState({
            changeWalkingClassCount: e.target.value,
        });
    };

    systemShift = () => {
        this.setState({
            visible: true,
        });
    };

    iconModalVisible = (e) => {
        this.setState({
            iconModalVisible: true,
        });
    };

    render() {
        const plainOptions = ['成绩均等', '男女均等'];
        const {
            visible,
            value,
            submitValue,
            loading,
            minQuantity,
            maxQuantity,
            numberOfShifts,
            iconModalVisible,
        } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const columns = [
            {
                title: '班级类型',
                dataIndex: 'classType',
                // key: 'name',
                align: 'center',
            },
            {
                title: '学生人数',
                dataIndex: 'studentsNumber',
                // key: 'age',
                align: 'center',
            },
            {
                title: '开班数量',
                dataIndex: 'shiftsCount',
                // key: 'address',
                align: 'center',
                render: (text, record, index) => {
                    console.log('first', text, record, index);
                    return (
                        <Input
                            className={styles.minQuantity}
                            // value={text}
                            onChange={(e) => this.changeNumber(e, index)}
                            defaultValue={text}
                        />
                    );
                },
            },
        ];

        const dataSource = [
            {
                key: 1,
                classType: '行政班',
                studentsNumber: '769',
                shiftsCount: '14',
            },
            {
                key: 2,
                classType: '物理',
                studentsNumber: '384',
                shiftsCount: '7',
            },
            {
                key: 3,
                classType: '化学',
                studentsNumber: '120',
                shiftsCount: '3',
            },
            {
                key: 4,
                classType: '生物',
                studentsNumber: '136',
                shiftsCount: '3',
            },
            {
                key: 5,
                classType: '技术',
                studentsNumber: '225',
                shiftsCount: '4',
            },
            {
                key: 6,
                classType: '政治',
                studentsNumber: '86',
                shiftsCount: '2',
            },
            {
                key: 7,
                classType: '历史',
                studentsNumber: '77',
                shiftsCount: '2',
            },
            {
                key: 8,
                classType: '地理',
                studentsNumber: '140',
                shiftsCount: '3',
            },
        ];
        return (
            <div className={styles.main}>
                {/* <div>
                    <p>
                        <span>每班人数区间:</span>
                        <Input
                            className={styles.minQuantity}
                            value={minQuantity}
                            onChange={this.changeMin}
                        />
                        ~
                        <Input
                            className={styles.maxQuantity}
                            value={maxQuantity}
                            onChange={this.changeMax}
                        />
                    </p>
                    <p>
                        <span>走班课位要求:</span>
                        <Input className={styles.remark}></Input>
                    </p>
                    <p>
                        <span>班级学生分布要求:</span>
                        <Checkbox.Group options={plainOptions} onChange={this.onChange} />
                    </p>
                </div> */}
                <p className={styles.ruleFont}>
                    1、填写每班人数限制，最少&nbsp;&nbsp;&nbsp;
                    <Input
                        className={styles.minQuantity}
                        value={minQuantity}
                        onChange={this.changeMin}
                    />
                    &nbsp;&nbsp;&nbsp; 人，最多&nbsp;&nbsp;&nbsp;
                    <Input
                        className={styles.maxQuantity}
                        value={maxQuantity}
                        onChange={this.changeMax}
                    />
                    &nbsp;&nbsp;&nbsp; 人
                </p>
                <p className={styles.ruleFont}>
                    2、希望&nbsp;&nbsp;&nbsp;
                    <Input className={styles.remark} onChange={this.changeCount} />
                    &nbsp;&nbsp;&nbsp; 个课位完成排课，其中走班期望占&nbsp;&nbsp;&nbsp;
                    <Input className={styles.remark} onChange={this.changeWalkingClassPosition} />
                    &nbsp;&nbsp;&nbsp; 个课位
                </p>
                <p className={styles.ruleFont}>
                    3、根据人数限制，我们计算好了每类班级的开班数量，如需调整可直接点击开班数量进行编辑
                </p>
                <div>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        style={{ marginBottom: '20px' }}
                        pagination={false}
                    />
                </div>
                <p className={styles.ruleFont}>
                    4、进一步设置分班规则
                    <span className={styles.ruleBatch} style={{ color: 'blue' }}>
                        批量设置
                    </span>
                </p>
                <div className={styles.setClassRule}>
                    <div className={styles.setRule}>
                        <div className={styles.setFist}>
                            <span>行政班1班</span>
                            <div>
                                <p>学生来源行政班：1-9班</p>
                                <p>定科：物理化学</p>
                                <p>成绩排名要求：排名靠前</p>
                                <p>成绩计算范围：语文、数学、英语、物理、化学</p>
                            </div>
                        </div>
                        <span className={styles.setSpan}>
                            <Icon type="form" onClick={this.iconModalVisible} />
                        </span>
                    </div>
                    <div className={styles.setRule}>
                        <div className={styles.setFist}>
                            <span>行政班1班</span>
                            <div>
                                <p>学生来源行政班：1-9班</p>
                                <p>定科：物理化学</p>
                                <p>成绩排名要求：排名靠前</p>
                                <p>成绩计算范围：语文、数学、英语、物理、化学</p>
                            </div>
                        </div>
                        <span className={styles.setSpan}>
                            <Icon type="form" />
                        </span>
                    </div>
                    <div className={styles.setRule}>
                        <div className={styles.setFist}>
                            <span>行政班1班</span>
                            <div>
                                <p>学生来源行政班：1-9班</p>
                                <p>定科：物理化学</p>
                                <p>成绩排名要求：排名靠前</p>
                                <p>成绩计算范围：语文、数学、英语、物理、化学</p>
                            </div>
                        </div>
                        <span className={styles.setSpan}>
                            <Icon type="form" />
                        </span>
                    </div>
                    <div className={styles.setRule}>
                        <div className={styles.setFist}>
                            <span>行政班1班</span>
                            <div>
                                <p>学生来源行政班：1-9班</p>
                                <p>定科：物理化学</p>
                                <p>成绩排名要求：排名靠前</p>
                                <p>成绩计算范围：语文、数学、英语、物理、化学</p>
                            </div>
                        </div>
                        <span className={styles.setSpan}>
                            <Icon type="form" />
                        </span>
                    </div>
                </div>
                <div className={styles.bottomButton}>
                    <Button style={{ marginRight: '30px' }}>取消</Button>
                    <Button
                        className={styles.divising}
                        type="primary"
                        onClick={() => this.systemShift()}
                    >
                        进行系统分班
                    </Button>
                </div>
                <Modal
                    title="系统分班"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={this.handleOk}
                        >
                            {submitValue}
                        </Button>,
                    ]}
                >
                    <p className={styles.selectHead}>
                        <span className={styles.left}>分班选项</span>
                        <Radio.Group onChange={this.onChangeType} value={value}>
                            <Radio style={radioStyle} value={1}>
                                清空当前分班结果重新进行分班
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                                保留当前分班结果，仅针对未分班学生进行分班
                            </Radio>
                        </Radio.Group>
                    </p>
                </Modal>
                <Modal
                    title="系统分班"
                    visible={iconModalVisible}
                    onOk={this.iconHandleOk}
                    onCancel={this.iconHandleCancel}
                    // footer={[
                    //     <Button key="back" onClick={this.handleCancel}>
                    //         取消
                    //     </Button>,
                    //     <Button
                    //         key="submit"
                    //         type="primary"
                    //         loading={loading}
                    //         onClick={this.handleOk}
                    //     >
                    //         {submitValue}
                    //     </Button>,
                    // ]}
                >
                    <p className={styles.selectHead}>
                        <span className={styles.left}>分班选项</span>
                        <Radio.Group onChange={this.onChangeType} value={value}>
                            <Radio style={radioStyle} value={1}>
                                清空当前分班结果重新进行分班
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                                保留当前分班结果，仅针对未分班学生进行分班
                            </Radio>
                        </Radio.Group>
                    </p>
                </Modal>
            </div>
        );
    }
}
