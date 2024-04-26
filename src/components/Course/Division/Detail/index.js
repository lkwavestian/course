import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Select, Icon, Steps, Divider, Modal, Input, Radio } from 'antd';
import ExportData from './exportData/index';
import DivisingData from './divisingData/index';
import CheckOutData from './checkOutData/index';
import Synchro from './synchro/index';

// import { trans, locale } from "../../../utils/i18n";

const { Option } = Select;
const { Step } = Steps;
@Form.create()
@connect((state) => ({
    detail: state.devision.detail,
    gradename: state.devision.gradename,
    importStudentColunteer: state.devision.importStudentColunteer,
    importStudentScoreList: state.devision.importStudentScoreList,
    importStudentClassList: state.devision.importStudentClassList,
    importStudentScoreListNull: state.devision.importStudentScoreListNull,
    importStudentColunteerNull: state.devision.importStudentColunteerNull,
    dividePlanDetail: state.devision.dividePlanDetail,
    devisionList: state.devision.devisionList,
    allGrades: state.devision.allGrades,
    editClassPlan: state.devision.editClassPlan,
    currentUser: state.global.currentUser,
    cards: state.devision.cards,
}))
export default class Detail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: this.props.id,
            current: 0,
            gradeName: '',
            columns: [],
            // importStudentScoreLists: this.props.importStudentScoreList,
            // importStudentColunteers: this.props.importStudentColunteer,
            editVisible: false,
            createVisible: false,
            divisionname: '',
            defaultSelectorId: '',
            division: [],
            schoolId: '',
            allGrades: [],
            defaultGrade: '',
            divideType: '',
            cardMsg: [],
        };
        // this.ref = null;
    }

    componentDidMount() {
        // this.getDetailById(this.props.id);
        // this.getImportStudentColunteer(this.props.id);
        // this.getImportStudentClass(this.props.id);
        // this.getImportStudentScore(this.props.id);
        // this.ref.getImportStudentColunteer(this.props.id);
        this.getCurrentUserInfo();
        document.title = '分班';
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'devision/dividePlanDetail',
        //     payload: {
        //         dividePlanId: this.props.id,
        //     },
        // });
        this.getDividePlanDetail();
    }

    changeStep = (current) => {
        this.setState({
            current,
        });
    };

    // getDetailById = (id) => {
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: "devision/getDetail",
    //     payload: {
    //       id,
    //     },
    //   }).then(() => {
    //     const { detail } = this.props;
    //     this.setState({
    //       gradeName: detail.className,
    //       stuList: detail.studentList,
    //     });
    //   });
    // };

    getImportStudentColunteer = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/importStudentColunteer',
            payload: {
                divideGroupId: id,
            },
        }).then(() => {
            const { importStudentColunteer } = this.props;
            this.setState({
                gradeName: importStudentColunteer.className,
                stuList: importStudentColunteer.studentList,
                columns: importStudentColunteer.columnsSet,
            });
        });
    };

    // getImportStudentClass = (id) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'devision/importStudentClassList',
    //         payload: {
    //             divideGroupId: id,
    //         },
    //     }).then(() => {
    //         const { importStudentClassList } = this.props;
    //         this.setState({
    //             gradeName: importStudentClassList.className,
    //             stuClass: importStudentClassList.studentList,
    //         });
    //     });
    // };

    // getImportStudentScore = (id) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'devision/importStudentScoreList',
    //         payload: {
    //             divideGroupId: this.props.id,
    //         },
    //     }).then(() => {
    //         const { importStudentScoreList } = this.props;
    //         this.setState({
    //             gradeName: importStudentScoreList.className,
    //             stuScore: importStudentScoreList.studentList,
    //         });
    //     });
    // };

    changeCurrent = () => {
        this.setState({
            current: 2,
        });
    };

    // onRef = (ref) => {
    //     this.ref = ref;
    // };
    goBack = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/importStudentColunteerNull',
            payload: '',
        });
        dispatch({
            type: 'devision/importStudentScoreListNull',
            payload: '',
        });
    };

    editChange = () => {
        this.setState({
            editVisible: true,
        });
    };

    // handleOk=()=>{
    //     this.setState({
    //         editVisible: true,
    //     });
    // }

    handleCancel = () => {
        this.setState({
            editVisible: false,
        });
    };

    /* handleChange = (value) => {
        console.log(`selected ${value}`);
    }; */

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
        const { dispatch } = this.props;
        // dispatch({
        //     type: 'devision/dividePlanDetail',
        //     payload: {
        //         dividePlanId: this.props.id,
        //     },
        // }).then(() => {
        this.getDividePlanDetail();
        const { dividePlanDetail, params } = this.props;
        this.setState(
            {
                createVisible: true,
                divisionname: dividePlanDetail.name,
                defaultSelectorId: dividePlanDetail.semesterId,
                divideType: dividePlanDetail.divideType,
            },
            () => {
                this.getDevisionList();
                this.getAllGrade();
            }
        );
        // });
    };

    getDividePlanDetail = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/dividePlanDetail',
            payload: {
                dividePlanId: this.props.id,
            },
        });
    };

    handleOk = () => {
        const { dispatch } = this.props;
        this.setState({
            createVisible: false,
        });
        dispatch({
            type: 'devision/editClassPlan',
            payload: {
                name: this.state.divisionname,
                semesterId: this.state.defaultSelectorId,
                type: this.state.divideType,
                gradeId: this.state.defaultGrade,
                dividePlanId: this.props.id,
            },
        }).then(() => {
            this.getDividePlanDetail();
        });
    };

    handleCancelImp = () => {
        const { devisionList, allGrades } = this.props;
        this.setState({
            createVisible: false,
            // defaultSelectorId: devisionList[0].id,
            // divisionname: '',
            // defaultGrade: allGrades[0].grade,
            // divideType: 0,
        });
    };

    changeName = (e) => {
        this.setState({
            divisionname: e.target.value,
        });
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
            // console.log('divisionList', divisionList);
            this.setState(
                {
                    division: devisionList,
                    // defaultSemesterId: devisionList[0].id,
                    // defaultSelectorId: devisionList[0].id,
                }
                // ,
                // () => {
                //     this.getCards();
                // }
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

    onChangeType = (e) => {
        this.setState({
            divideType: e.target.value,
        });
    };

    render() {
        const {
            current,
            stuList,
            stuClass,
            stuScore,
            columns,
            division,
            allGrades,
            defaultGrade,
            cardMsg,
        } = this.state;
        const { params, title, dividePlanDetail, devisionList } = this.props;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className={styles.division}>
                <div className={styles.classHead}>
                    <div className={styles.headContent}>
                        <Link to="/course/index/6">
                            <Icon
                                type="left-circle"
                                style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }}
                                onClick={this.goBack}
                            />
                        </Link>

                        {/* {params && params.title ? <span>{params.title}</span> : ''} */}
                        {dividePlanDetail && dividePlanDetail.name ? (
                            <span>{dividePlanDetail.name}</span>
                        ) : (
                            ''
                        )}
                        <Icon
                            type="edit"
                            style={{ marginTop: 15, marginLeft: 15 }}
                            onClick={() => this.showModal()}
                        />
                        {this.state.createVisible && (
                            <Modal
                                title="编辑分班方案"
                                visible={this.state.createVisible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancelImp}
                            >
                                <p className={styles.divisionName}>
                                    <span style={{ lineHeight: '40px' }}>分班方案名称:</span>
                                    <Input
                                        className={styles.nameInfo}
                                        defaultValue={dividePlanDetail.name}
                                        onChange={this.changeName}
                                        placeholder="请输入分班方案名称"
                                    />
                                </p>
                                <p className={styles.selector}>
                                    <span className={styles.semester}>所属学期:</span>
                                    <Select
                                        className={styles.bottomSel}
                                        // defaultValue={26}
                                        defaultValue={dividePlanDetail.semesterId}
                                        // value={26}
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
                                        defaultValue={dividePlanDetail.gradeId}
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
                                            defaultValue={dividePlanDetail.divideType}
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
                        )}

                        <Steps
                            current={current}
                            onChange={this.changeStep}
                            className={styles.steps}
                        >
                            <Step title="导入分班数据" />
                            <Step title="进行分班" />
                            <Step title="查看分班结果" />
                            <Step title="同步分班结果" />
                        </Steps>
                    </div>
                </div>

                {current == 0 ? (
                    <ExportData
                        stuList={stuList}
                        columns={columns}
                        // stuScore={stuScore}
                        // stuClass={stuClass}
                        id={this.props.id}
                        // onRef={this.onRef}
                        getImportStudentColunteer={this.getImportStudentColunteer}
                        // getImportStudentScore={this.getImportStudentScore}
                        // getImportStudentClass={this.getImportStudentClass}
                    />
                ) : current == 1 ? (
                    <DivisingData changeCurrent={this.changeCurrent} />
                ) : current == 2 ? (
                    <CheckOutData id={this.props.id} num={this.props.params.num} />
                ) : (
                    <Synchro id={this.props.id}></Synchro>
                )}
                {/* <Modal
                    title="编辑班级"
                    visible={editVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className={styles.mainEdit}>
                        <div className={styles.editWriteDiv}>
                            <span className={styles.editWrite}>班级名称</span>
                            <Input size="large" placeholder="large size" style={{ width: 240 }} />
                        </div>
                        <div className={styles.editWriteDiv}>
                            <span className={styles.editWrite} style={{ paddingLeft: '28px' }}>
                                课位
                            </span>
                            <Select
                                defaultValue="lucy"
                                size="large"
                                style={{ width: 240 }}
                                onChange={this.handleChange}
                            >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="disabled" disabled>
                                    Disabled
                                </Option>
                                <Option value="Yiminghe">yiminghe</Option>
                            </Select>
                        </div>
                        <div className={styles.editWriteDiv}>
                            <span className={styles.editWrite} style={{ paddingLeft: '28px' }}>
                                教师
                            </span>
                            <Input size="large" placeholder="large size" style={{ width: 240 }} />
                        </div>
                        <div className={styles.editWriteDiv}>
                            <span
                                style={{
                                    display: 'block',
                                    width: '405px',
                                    paddingLeft: '154px',
                                    textAlign: 'initial',
                                }}
                            >
                                若教学班有多门课填写示例：陈龙（信息技术）、陈军辉（通用技术）
                            </span>
                        </div>
                    </div>
                </Modal> */}
            </div>
        );
    }
}
