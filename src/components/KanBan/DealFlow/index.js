//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Form, Select, Input, DatePicker, Table, Pagination, Button, Tabs, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { trans, locale } from '../../../utils/i18n';
import icon from '../../../icon.less';
import GradeTable from './gradeTable/index.js';
import TemplateModal from '../../../components/TemplateModal/index';
import cs from 'classnames';
import { getUrlSearch } from '../../../utils/utils';
import { isEmpty } from 'lodash';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { TabPane } = Tabs;

@connect((state) => ({
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    transactionsDetailList: state.order.transactionsDetailList,
    busiAndChannelList: state.account.busiAndChannelList,

    subjectChief: state.order.subjectChief,
    disciplineManagement: state.order.disciplineManagement,
    gradeDetails: state.order.gradeDetails,
    sectionList: state.order.sectionList,
    currentSemesterSubject: state.order.currentSemesterSubject,
    planningSemesterInfo: state.course.planningSemesterInfo,
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    currentUser: state.global.currentUser,

    stageSubject: state.order.stageSubject,
}))
export default class DealFlow extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: '',
            tableList: [], // 列表
            sumAmount: '', // 总交易金额
            businessesId: '', //  商户id
            deadlineBegin: '', // 起始时间
            deadlineEnd: '', // 截至时间
            keyValue: '', // 关键字
            busiList: '', // 商户下拉菜单数据
            channelId: '', // 支付方式id
            schoolSectionKey: undefined,
            visible: false,
            gradeKey: '',
            disciplineManagementList: [],
            showTemplateModal: false,
            checkIdList: [],
            semesterValue: '',
            stageKey: '',
            stageValue: '',
            schoolId: '',
            modalTitle: '', //报表设置标题

            navTop: false,
            showStageManagement: false,
            showSubjectManagement: false,
            showClassMentor: false,
        };
        this.$tab = null;
        this.offsetTop = 0;
        this.openStageList =
            typeof openStageList != 'undefined' && openStageList.length > 0 ? openStageList : [];
    }

    componentWillMount() {
        this.setState({
            schoolSectionKey:
                typeof openStageList != 'undefined' && openStageList.length > 0
                    ? openStageList[0]
                    : undefined,
        });
    }

    componentDidMount() {
        this.getPlanningSchool();
        this.$tab = document.getElementById('tab');
        if (this.$tab) {
            this.offsetTop = this.$tab.offsetTop;
            window.addEventListener('scroll', this.handleScroll);
        }
    }

    handleScroll = () => {
        let sTop =
            document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

        if (!this.state.navTop && sTop >= this.offsetTop) {
            this.setState({
                navTop: true,
            });
        }

        if (sTop < this.offsetTop) {
            this.setState({
                navTop: false,
            });
        }
    };

    getContent = () => {
        this.props
            .dispatch({
                type: 'order/stageSubject',
                payload: {
                    semesterId: this.state.semesterValue, //学期ID
                    sheetType: 2,
                },
            })
            .then(() => {
                const { stageSubject } = this.props;

                let showConfig =
                    stageSubject.length > 0 && stageSubject[0].showConfig
                        ? JSON.parse(stageSubject[0].showConfig)
                        : {};

                if (!isEmpty(showConfig)) {
                    this.setState({
                        showStageManagement: showConfig?.showStageManagement || false,
                        showSubjectManagement: showConfig?.showSubjectManagement || false,
                        showClassMentor: showConfig?.showClassMentor || false,
                    });
                }
            });
    };

    //获取学期列表
    getSemesterInfo = () => {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId,
            },
            onSuccess: () => {
                const { planningSemesterInfo } = this.props;
                let now = Date.parse(new Date());
                if (planningSemesterInfo && planningSemesterInfo.length > 0) {
                    this.setState({
                        modalTitle: `${planningSemesterInfo[0].schoolYearName}${planningSemesterInfo[0].name}`,
                    });
                }
                planningSemesterInfo &&
                    planningSemesterInfo.length > 0 &&
                    planningSemesterInfo.map((item, index) => {
                        if (now >= item.startTime && now <= item.endTime) {
                            this.setState(
                                {
                                    semesterValue: item.id,
                                },
                                () => {
                                    this.getContent();
                                }
                            );
                        } else {
                            if (index == 0) {
                                this.setState(
                                    {
                                        semesterValue: item.id,
                                    },
                                    () => {
                                        this.getContent();
                                    }
                                );
                            }
                        }
                    });
                this.getDisciplineManagementList();
                this.getSubjectChief();
                this.child.getSubjectChiefList();
            },
        });
    };

    //获取学校列表
    getPlanningSchool = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCouserPlanningSchoolList',
            onSuccess: () => {
                const { currentUser, planningSchoolListInfo } = this.props;
                this.setState(
                    {
                        schoolId: planningSchoolListInfo && planningSchoolListInfo[0].schoolId,
                    },
                    () => {}
                );
            },
        }).then(() => {
            if (this.props.planningSchoolListInfo && this.props.planningSchoolListInfo.length > 0) {
                this.getSemesterInfo();
            }
        });
    };

    // 获取学段管理列表
    getDisciplineManagementList = () => {
        const { dispatch } = this.props;
        const { semesterValue, schoolSectionKey } = this.state;

        dispatch({
            type: 'order/disciplineManagement',
            payload: {
                semesterId: semesterValue,
                stage: schoolSectionKey,
            },
        });
    };

    // 获取学科首席列表
    getSubjectChief = () => {
        const { dispatch } = this.props;
        const { semesterValue, checkIdList, schoolSectionKey } = this.state;
        dispatch({
            type: 'order/subjectChief',
            payload: {
                semesterId: semesterValue,
                stage: schoolSectionKey,
                subjectIdList: checkIdList,
            },
        });
    };

    // 导出
    exportBatch = () => {
        const { keyValue, page, businessesId, pageSize, deadlineBegin, deadlineEnd } = this.state;
        window.open(
            `/api/pay/exportTransactionsDetail?businessesId=${businessesId}&payTimeBegin=${deadlineBegin}&payTimeEnd=${deadlineEnd}&tuitionOrderNo=${keyValue}&pageNum=${page}&pageSize=${pageSize}`
        );
    };

    callback = (key) => {
        this.setState(
            {
                schoolSectionKey: key,
            },
            () => {
                this.getPlanningSchool();
            }
        );
    };

    changeGrade = (key) => {
        let anchorH = document.getElementById(key).offsetTop;

        if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = anchorH;
        } else if (document.body.scrollTop) {
            document.body.scrollTop = anchorH;
        } else {
            //这个else指以上两种值均为0的状态，有一者是恒为0的，另一者可能因为回到顶部等操作被置为0，便会出现这种状况
            document.documentElement.scrollTop = anchorH;
            document.body.scrollTop = anchorH;
        }
        //window.scrollTo(0,anchorH)  //若以上scrollTop方式不生效，可使用此scrollTo方式，但注意scrollTo在安卓手机上存在兼容性问题
        this.setState({
            gradeKey: key,
        });
    };

    showModal = () => {
        this.setState({
            // visible: true,
            showTemplateModal: true,
        });
    };

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    goAnchorPoint(elemId) {
        let anchorH = document.getElementById(elemId).offsetTop;

        if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = anchorH;
        } else if (document.body.scrollTop) {
            document.body.scrollTop = anchorH;
        } else {
            //这个else指以上两种值均为0的状态，有一者是恒为0的，另一者可能因为回到顶部等操作被置为0，便会出现这种状况
            document.documentElement.scrollTop = anchorH;
            document.body.scrollTop = anchorH;
        }

        //window.scrollTo(0,anchorH)  //若以上scrollTop方式不生效，可使用此scrollTo方式，但注意scrollTo在安卓手机上存在兼容性问题
    }

    getDun = (key, index) => {
        if (key.length > 0 && key.length - 1 !== index) {
            return <span>、</span>;
        }
    };

    //关闭模板弹窗
    closeTemplateModal = () => {
        this.setState(
            {
                showTemplateModal: false,
            },
            () => {
                this.getContent();
                this.getDisciplineManagementList();
                this.getSubjectChief();
                this.getSubjectChiefList();
            }
        );
    };

    // 获取年级明细列表
    getSubjectChiefList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'order/gradeDetails',
            payload: {
                stage: this.state.schoolSectionKey,
                semesterId: this.state.semesterValue,
                subjectIdList: this.state.checkIdList,
            },
        });
    };

    getCheckIdList = (keyList, value) => {
        this.setState(
            {
                checkIdList: keyList,
                stageValue: value,
            },
            () => {
                this.getSubjectChief();
                this.child.getSubjectChiefList();
            }
        );
    };

    changeSemester = (value, e) => {
        this.setState(
            {
                semesterValue: value,
                modalTitle: e.key,
            },
            () => {
                this.getDisciplineManagementList();
                this.getSubjectChief();
                this.child.getSubjectChiefList();
            }
        );
    };

    onRef = (ref) => {
        this.child = ref;
    };

    handleChange = (value) => {
        this.setState(
            {
                schoolId: value,
            },
            () => {
                this.getSemesterInfo();
                // this.getDisciplineManagementList();
                // this.getSubjectChief();
                // this.child.getSubjectChiefList();
            }
        );
    };

    render() {
        const {
            page,
            pageSize,
            total,
            tableList,
            sumAmount,
            busiList,
            channelList,
            schoolSectionKey,
            gradeKey,
            disciplineManagementList,
            semesterValue,
            schoolId,
            showStageManagement,
            showSubjectManagement,
            showClassMentor,
        } = this.state;

        const {
            disciplineManagement,
            subjectChief,
            gradeDetails,
            planningSemesterInfo,
            planningSchoolListInfo,
        } = this.props;

        const data = [];
        if (tableList.length) {
            for (let i = 0; i < tableList.length; i++) {
                data.push({
                    key: i,
                    orderNo: tableList[i].orderNo,
                    payway: tableList[i].accountUrl,
                    payTime: tableList[i].payTime,
                    amount: tableList[i].amount,
                    status: tableList[i].payStatus,
                    tuitionOrderNo: tableList[i].tuitionOrderNo,
                    channelTradeNo: tableList[i].channelTradeNo,
                    businessesId: tableList[i].businessesId,
                });
            }
        }

        return (
            <div className={styles.dealFlow}>
                <div className={styles.formParent}>
                    <div className={styles.topLeft}>
                        <Form className={styles.form} layout="inline">
                            <Form.Item>
                                <Select
                                    value={schoolId}
                                    className={styles.selectStyle}
                                    onChange={this.handleChange}
                                    style={{ width: '168px', height: '36px' }}
                                >
                                    {planningSchoolListInfo &&
                                        planningSchoolListInfo.length > 0 &&
                                        planningSchoolListInfo.map((item, index) => {
                                            return (
                                                <Option value={item.schoolId} key={item.schoolId}>
                                                    <span
                                                        title={
                                                            locale() != 'en'
                                                                ? item.name
                                                                : item.englishName
                                                        }
                                                    >
                                                        {locale() != 'en'
                                                            ? item.name
                                                            : item.englishName}
                                                    </span>
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Select
                                    size="large"
                                    value={semesterValue}
                                    onChange={this.changeSemester}
                                    placeholder="请选择学期"
                                    style={{ width: '168px', height: '36px' }}
                                >
                                    {planningSemesterInfo &&
                                        planningSemesterInfo.length > 0 &&
                                        planningSemesterInfo.map((item, index) => {
                                            return (
                                                <Option
                                                    value={item.id}
                                                    key={`${item.schoolYearName}${item.name}`}
                                                >
                                                    {locale() != 'en' ? (
                                                        <span>
                                                            {item.schoolYearName} {item.name}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {item.schoolYearEname} {item.ename}
                                                        </span>
                                                    )}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                        </Form>
                        <Tabs activeKey={this.state.schoolSectionKey} onChange={this.callback}>
                            {!isEmpty(this.openStageList)
                                ? this.openStageList.map((item) => {
                                      return (
                                          <TabPane
                                              tab={
                                                  item == 1
                                                      ? '幼儿园'
                                                      : item == 2
                                                      ? '小学'
                                                      : item == 3
                                                      ? '初中'
                                                      : item == 4
                                                      ? '高中'
                                                      : ''
                                              }
                                              key={item}
                                          />
                                      );
                                  })
                                : null}
                        </Tabs>
                        {/* <div onClick={() => this.goAnchorPoint('demoAnchor')}>初中</div> */}
                    </div>
                    <div className={styles.titleRight}>
                        <span className={styles.reportSetting} onClick={this.showModal}>
                            <i className={icon.iconfont} style={{ marginRight: '5px' }}>
                                &#xe6b3;
                            </i>
                            报表设置
                        </span>
                        {/* <Button type="primary" className={styles.export} onClick={this.exportBatch}>
                            {trans('global.Export', '导出')}
                        </Button> */}
                    </div>
                </div>

                <div className={styles.tableAndPage}>
                    {this.state.showStageManagement && (
                        <div className={styles.tableAndPageDiv}>
                            <h4>学段管理岗位</h4>
                            <table>
                                <tr
                                    style={{
                                        background: 'rgb(249, 249, 249)',
                                        height: '38px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {disciplineManagement &&
                                        disciplineManagement.length > 0 &&
                                        disciplineManagement.map((item, index) => {
                                            return <td>{item.roleName}</td>;
                                        })}
                                </tr>
                                <tr
                                    style={{
                                        height: '38px',
                                        borderBottom: '1px solid #e8e8e8',
                                    }}
                                >
                                    {disciplineManagement &&
                                        disciplineManagement.length > 0 &&
                                        disciplineManagement.map((item, index) => {
                                            return (
                                                <td>
                                                    {item.roleTeacherList &&
                                                        item.roleTeacherList.length > 0 &&
                                                        item.roleTeacherList.map((el, index) => {
                                                            return (
                                                                <span>
                                                                    {el.name}
                                                                    {this.getDun(
                                                                        item.roleTeacherList,
                                                                        index
                                                                    )}
                                                                </span>
                                                            );
                                                        })}
                                                </td>
                                            );
                                        })}
                                </tr>
                            </table>
                            {/* // ) : null} */}
                        </div>
                    )}
                    {this.state.showSubjectManagement && (
                        <div className={styles.tableAndPageDiv}>
                            <h4>学科首席/学科组长</h4>
                            <div style={{ overflowX: 'scroll' }}>
                                {/* {schoolSectionKey == 1 || 3 ? ( */}
                                <table style={{ overflowX: 'scroll', minWidth: '1000px' }}>
                                    <tr
                                        style={{
                                            background: 'rgb(249, 249, 249)',
                                            height: '38px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {subjectChief &&
                                            subjectChief.length > 0 &&
                                            subjectChief.map((item, index) => {
                                                return (
                                                    <td
                                                        style={{
                                                            minWidth: '140px',
                                                            padding: '9.5px 10px',
                                                        }}
                                                    >
                                                        {item.subjectName}
                                                    </td>
                                                );
                                            })}
                                    </tr>
                                    <tr
                                        style={{
                                            height: '38px',
                                            borderBottom: '1px solid #e8e8e8',
                                        }}
                                    >
                                        {subjectChief &&
                                            subjectChief.length > 0 &&
                                            subjectChief.map((el, order) => {
                                                return (
                                                    <td className={styles.commonStyle}>
                                                        {el.teacherList &&
                                                            el.teacherList.length > 0 &&
                                                            el.teacherList.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        {item.name}
                                                                        {this.getDun(
                                                                            el.teacherList,
                                                                            index
                                                                        )}
                                                                    </>
                                                                );
                                                            })}
                                                    </td>
                                                );
                                            })}
                                    </tr>
                                </table>
                                {/* ) : null} */}
                            </div>
                        </div>
                    )}
                    <div className={styles.detailCon}>
                        <p
                            id="tab"
                            style={{
                                position: this.state.navTop ? 'fixed' : null,
                                top: 0,
                                background: this.state.navTop ? 'rgb(249, 249, 249)' : null,
                                width: this.state.navTop ? '100%' : null,
                                // background: '#e8e8e8',
                            }}
                        >
                            <span id="demoAnchor" onClick={() => this.goAnchorPoint('demoAnchor')}>
                                年级明细
                            </span>
                            {gradeDetails &&
                                gradeDetails.length > 0 &&
                                gradeDetails.map((item, index) => {
                                    return (
                                        <>
                                            <span
                                                className={
                                                    gradeKey == item.gradeId
                                                        ? styles.detailSpanAfter
                                                        : styles.detailSpan
                                                }
                                                onClick={() => this.changeGrade(item.gradeId)}
                                                // onClick={() => this.goAnchorPoint('demoAnchor')}
                                            >
                                                {item.gradeName}
                                            </span>
                                        </>
                                    );
                                })}
                        </p>
                        <div style={{ overflowX: 'scroll', position: 'relative', height: '500px' }}>
                            <GradeTable
                                gradeKey={gradeKey}
                                schoolSectionKey={schoolSectionKey}
                                checkIdList={this.state.checkIdList}
                                semesterValue={this.state.semesterValue}
                                onRef={this.onRef}
                                {...this.props}
                                showClassMentor={this.state.showClassMentor}
                            />
                        </div>
                    </div>
                </div>

                <Modal
                    closable={false}
                    visible={this.state.showTemplateModal}
                    onCancel={this.closeTemplateModal}
                    footer={null}
                    width="100%"
                    className={styles.templateModalContent}
                    destroyOnClose
                >
                    <TemplateModal
                        onClose={this.closeTemplateModal}
                        modalTitle={this.state.modalTitle}
                        getCheckIdList={this.getCheckIdList.bind(this)}
                        semesterValue={this.state.semesterValue}
                        sheetType={this.props.sheetType}
                        schoolSectionKey={this.state.schoolSectionKey}
                    />
                </Modal>
            </div>
        );
    }
}
