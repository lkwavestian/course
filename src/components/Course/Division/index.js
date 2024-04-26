import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Select, Button, Modal, Radio, Input } from 'antd';

import { trans, locale } from '../../../utils/i18n';

const { Option } = Select;
@Form.create()
@connect((state) => ({
    devisionList: state.devision.devisionList,
    gradename: state.devision.gradename,
    cards: state.devision.cards,
    allGrades: state.devision.allGrades,
    currentUser: state.global.currentUser,
}))
class Devision extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            division: [],
            defaultSemesterId: '',
            defaultSelectorId: '',
            cardMsg: [],
            createVisible: false,
            divisionType: 0,
            allGrades: [],
            defaultGrade: '',
            schoolId: '',
            divisionname: '',
        };
    }

    componentDidMount() {
        this.getCurrentUserInfo();
    }

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            this.setState(
                {
                    schoolId: currentUser.schoolId,
                },
                () => {
                    this.getDevisionList();
                }
            );
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };

    getDevisionList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/getDevisionList',
            payload: {
                schoolId: this.state.schoolId,
            },
        }).then(() => {
            const { devisionList } = this.props;

            this.setState(
                {
                    division: devisionList,
                    defaultSemesterId: devisionList[0].id,
                    defaultSelectorId: devisionList[0].id,
                },
                () => {
                    this.getCards();
                }
            );
        });
    }

    getCards() {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/getCardMsg',
            payload: {
                // schoolId: this.state.schoolId,
                semesterId: this.state.defaultSemesterId,
            },
        }).then(() => {
            const { cards } = this.props;
            this.setState({
                cardMsg: cards,
            });
        });
    }

    changeSemester = (value) => {
        this.setState(
            {
                defaultSemesterId: value,
            },
            () => {
                this.getCards();
            }
        );
    };

    changeSelectId = (value) => {
        this.setState({
            defaultSelectorId: value,
        });
    };

    changeGrade = (value) => {
        this.setState({
            defaultGrade: value,
        });
    };

    getAllGrade = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/getAllGrade',
            payload: {},
        }).then(() => {
            const { allGrades } = this.props;
            this.setState({
                allGrades,
                defaultGrade: allGrades[0].grade,
            });
        });
    };

    showModal = () => {
        this.setState(
            {
                createVisible: true,
            },
            () => {
                this.getAllGrade();
            }
        );
    };

    handleOk = () => {
        const { dispatch } = this.props;
        this.setState({
            createVisible: false,
        });
        dispatch({
            type: 'devision/addDivision',
            payload: {
                name: this.state.divisionname,
                semesterId: this.state.defaultSelectorId,
                type: this.state.divisionType,
                gradeId: this.state.defaultGrade,
            },
        }).then(() => {
            const { devisionList, allGrades } = this.props;
            this.setState({
                defaultSelectorId: devisionList[0].id,
                divisionname: '',
                defaultGrade: allGrades[0].grade,
                divisionType: 0,
            });
            this.getCards();
        });
    };

    handleCancel = () => {
        const { devisionList, allGrades } = this.props;
        this.setState({
            createVisible: false,
            defaultSelectorId: devisionList[0].id,
            divisionname: '',
            defaultGrade: allGrades[0].grade,
            divisionType: 0,
        });
    };

    onChangeType = (e) => {
        this.setState({
            divisionType: e.target.value,
        });
    };

    changeName = (e) => {
        this.setState({
            divisionname: e.target.value,
        });
    };

    setGradeName = (name) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/setGradeName',
            payload: name,
        });
    };

    render() {
        const {
            division,
            defaultSemesterId,
            cardMsg,
            defaultSelectorId,
            allGrades,
            defaultGrade,
            divisionname,
        } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div>
                <div className={styles.header}>
                    <Select
                        value={defaultSemesterId}
                        className={styles.semesterSel}
                        onChange={this.changeSemester}
                    >
                        {division &&
                            division.length > 0 &&
                            division.map((item, index) => {
                                return (
                                    <Option value={item.id} key={item.id}>
                                        <span>{item.officialSemesterName}</span>
                                    </Option>
                                );
                            })}
                    </Select>
                    <Button type="primary" onClick={() => this.showModal()}>
                        新建分班方案
                    </Button>
                    <Modal
                        title="新建分班方案"
                        visible={this.state.createVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <p className={styles.divisionName}>
                            <span style={{ lineHeight: '40px' }}>分班方案名称:</span>
                            <Input
                                className={styles.nameInfo}
                                value={divisionname}
                                onChange={this.changeName}
                                placeholder="请输入分班方案名称"
                            ></Input>
                        </p>
                        <p className={styles.selector}>
                            <span className={styles.semester}>所属学期:</span>
                            <Select
                                className={styles.bottomSel}
                                value={defaultSelectorId}
                                onChange={this.changeSelectId}
                            >
                                {division &&
                                    division.length > 0 &&
                                    division.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                <span>{item.officialSemesterName}</span>
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </p>
                        <p className={styles.selector}>
                            <span className={styles.semester}>学生范围:</span>
                            <Select
                                className={styles.bottomSel}
                                value={defaultGrade}
                                onChange={this.changeGrade}
                            >
                                {allGrades &&
                                    allGrades.length > 0 &&
                                    allGrades.map((item, index) => {
                                        return (
                                            <Option value={item.grade} key={item.id}>
                                                <span>{item.orgName}</span>
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </p>
                        <p className={styles.main}>
                            <span className={styles.divisionTypes}>分班类型:</span>
                            <span className={styles.selectors}>
                                <Radio.Group
                                    onChange={this.onChangeType}
                                    value={this.state.divisionType}
                                >
                                    <Radio style={radioStyle} value={0}>
                                        根据成绩进行行政班分班
                                    </Radio>
                                    <Radio style={radioStyle} value={1}>
                                        根据选考志愿和成绩进行行政及教学班分班
                                    </Radio>
                                    <Radio style={radioStyle} value={2}>
                                        根据选考志愿和成绩进行教学班分班（行政班不变）
                                    </Radio>
                                </Radio.Group>
                            </span>
                        </p>
                    </Modal>
                </div>
                <div className={styles.card}>
                    {cardMsg &&
                        cardMsg.length > 0 &&
                        cardMsg.map((item, index) => {
                            return (
                                //   <Link to={`/course/index/6:${item.id}`} target="_self">
                                // onClick={()=>{window.open('/#/course/index/6:' + item.id)}}
                                // <Link to='/course/index/6:' target="_self">
                                <Link
                                    to={`/Division/index/${item.id}/${item.flowGroupNumber}`}
                                    // }/${encodeURIComponent(item.name)}`}
                                    /* to={{
                                        pathname: `/Division/index/${item.id}`,
                                        state: { title: item.name },
                                    }} */
                                    onClick={() => this.setGradeName(item.name)}
                                    target="_self"
                                >
                                    <p className={styles.msg}>
                                        <span>{item.name}</span>
                                        <span>点击卡片进入分班详情</span>
                                    </p>
                                </Link>
                            );
                        })}
                </div>
            </div>
        );
    }
}

export default Devision;
